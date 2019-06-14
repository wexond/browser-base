import { Store } from './store'
import { ipcMain } from 'electron';
import { ChildProcess } from 'child_process'
const { PassThrough, Writable } = require('stream')
const ff = require('./ffmpeg')
const ffprobe  = require('ffprobe')
const ffprobeStatic  = require('ffprobe-static')
const ffplay = require('./ffplay')
const ffprobeTimeout = 5000000

export class Player {
  private currentPipeline?: ChildProcess
  private segmentInterval: number
  private currentStreams?: any

  constructor(private store: Store) {
    this.initListener()
  }

  updateChannelData (stream: any) {
    const channelData = this.store.get('channelData')
    channelData[stream.url] = stream
    this.store.set('channelData', channelData)
  }

  private initListener () {

    ipcMain.on('closestream', (evt: any) => {
      this.currentPipeline && this.currentPipeline.kill()
      evt.sender.send('streamclosed')
      this.segmentInterval && clearInterval(this.segmentInterval)
    })

    ipcMain.on('pausestream', (evt: any) => {
      this.currentPipeline && this.currentPipeline.kill('SIGSTOP')
      evt.sender.send('streampaused')
    })

    ipcMain.on('resumestream', (evt: any) => {
      this.currentPipeline && this.currentPipeline.kill('SIGCONT')
      evt.sender.send('streamresumed')

    })

    ipcMain.on('getaudiostream' , (evt: any) => {
      const audio = (this.currentStreams) ? this.currentStreams.audio : {}
      evt.sender.send('audiostreams', audio)
    })

    ipcMain.on('getSubtitleStreams' , (evt: any) => {
      const subtitles = (this.currentStreams) ? this.currentStreams.subtitles : {}
      evt.sender.send('subtitleStreams', subtitles)
    })

    ipcMain.on('setaudiostream', (evt: any, selectedAudioStream: any) => {

            // retrieve proper
      this.currentStreams.audio.currentStream = selectedAudioStream
      this.playUrl(this.currentStreams.url, this.currentStreams, evt)
      this.updateChannelData(this.currentStreams)
    })

    ipcMain.on('setsubtitlestream', (evt: any, selectedSubtitleStream: any) => {
            // retrieve proper
      if (selectedSubtitleStream !== this.currentStreams.subtitles.currentStream) {
        this.currentStreams.subtitles.currentStream = selectedSubtitleStream
        this.playUrl(this.currentStreams.url, this.currentStreams, evt)
        this.updateChannelData(this.currentStreams)
      }
    })

    ipcMain.on('openurl', (evt: any, url: string) => {

      const channelData = this.store.get('channelData')

      if (channelData[url]) {
        let localCurrentStream: any
        this.currentStreams = localCurrentStream = channelData[url]
        this.playUrl(url, this.currentStreams, evt)

        ffprobe(`${url}?timeout=${ffprobeTimeout}`, { path: ffprobeStatic.path }, (err: Error, metadata?: any) => {
          if (metadata) {
            const newStreamData = this.processStreams(metadata.streams, url)
                         // callback might be received when the streams has already change, do not pay attention.
            if (this.currentStreams.video.tracks[0].codec_name !== newStreamData.video.tracks[0].codec_name && localCurrentStream.url === this.currentStreams.url) {
              console.log('probe play url:', url)
              this.playUrl(newStreamData.url, newStreamData, evt)

            }else {
              console.log('-----------do not play old data')
            }

            if (localCurrentStream.url === this.currentStreams.url) {
                            // we keep current subtilte and audio
              newStreamData.subtitles.currentStream = this.currentStreams.subtitles.currentStream
              newStreamData.audio.currentStream = this.currentStreams.audio.currentStream
              this.currentStreams = newStreamData
            }
            this.updateChannelData(localCurrentStream)
          }
        })
      } else {
        ffprobe(`${url}?timeout=${ffprobeTimeout}`, { path: ffprobeStatic.path }, (err: Error, metadata: any) => {

          if (metadata) {
            this.currentStreams = this.processStreams(metadata.streams, url)
            this.updateChannelData(this.currentStreams)
            this.playUrl(this.currentStreams.url, this.currentStreams, evt)

          } else {
            console.log('ffprobe failure')
            evt.sender.send('nativePlayer')
          }
        })
      }
    })
  }

  handleConversionError (evt: any) {
        // if conversion error, keep trying this.playUrl will kill previous process
    this.playUrl(this.currentStreams.url, this.currentStreams, evt)
  }

  handleErroneousStreamError(evt: any) {
    this.currentStreams.audio.currentStream = (this.currentStreams.audio.tracks.length > 0) ? this.currentStreams.audio.tracks[0].pid :-1
    this.currentStreams.subtitles.currentStream = -1
    this.playUrl(this.currentStreams.url, this.currentStreams, evt)

  }

  playUrl (url: string, streamToPlay: any, evt: any) {

    console.log('----------- playUrl', url)

    if (streamToPlay.video.tracks.length > 0) {
      const currentVideoCodec = streamToPlay.video.tracks[0].codec_name
      const videoStreamChannel = streamToPlay.video.tracks[0].pid
      const subtitleStreamChannel = streamToPlay.subtitles.currentStream

      const audiostreamChannel = streamToPlay.audio.currentStream
      this.currentPipeline && this.currentPipeline.kill()
      let ready = false
      let firstChunk = true
      let buf = Buffer.alloc(0)
      const isDeinterlacingEnabled = this.store.get('deinterlacing')
      this.currentPipeline = ff.getMpegtsPipeline(
        url,
        audiostreamChannel,
        videoStreamChannel,
        currentVideoCodec,
        subtitleStreamChannel,
        isDeinterlacingEnabled,
        () => this.handleConversionError(evt),
        () => this.handleErroneousStreamError(evt))

      const mp4SegmentBufferer = new Writable({
        write(chunk: any, encoding: any, callback: any) {
          ready = true
          buf = Buffer.concat([buf, chunk])
          callback()
        },
      });
      (this.currentPipeline as any).pipe(mp4SegmentBufferer)

      this.segmentInterval && clearInterval(this.segmentInterval)
      this.segmentInterval = setInterval(() => {
        if (!ready) return
        evt.sender.send('segment', { buffer: buf, isFirst: firstChunk })
        buf = Buffer.alloc(0)
        firstChunk = false
      }, 300)
    } else {
      this.currentPipeline && this.currentPipeline.kill()
      this.currentPipeline = ffplay.playStream(url)
      evt.sender.send('nativePlayer')
    }
  }

  processStreams (streams: any, url: string): any {
    const tempCurrentStreams: any = {
      url,
      audio : {
        tracks: [],
      },
      video : {
        tracks:[],
      },
      subtitles: {
        tracks: [],
      },
    }
    streams.filter((streamData: any)  => streamData.codec_type === 'audio')
      .forEach(
        (stream: any, index: number) => tempCurrentStreams.audio.tracks
          .push({
            index ,
            code: (stream.tags && stream.tags.language !== '???') ? stream.tags.language : 'zzz',
            pid: stream.index, codec_name: stream.codec_name,
          }),
      )
    streams
      .filter((streamData: any)  => streamData.codec_type === 'subtitle')
      .forEach((stream: any, index: number) => {
        if (stream.codec_name && stream.codec_name !== 'dvb_teletext') {
          tempCurrentStreams.subtitles.tracks
            .push({
              index ,
              code: (stream.tags.language === '???') ? 'zzz' :stream.tags.language,
              pid: stream.index, codec_name: stream.codec_name,
            })
        }
      })
    streams
      .filter((streamData: any)  => streamData.codec_type === 'video')
      .forEach((stream: any, index: number) => tempCurrentStreams.video.tracks
        .push({ index ,  pid: stream.index, codec_name: stream.codec_name }))

    tempCurrentStreams.audio.currentStream = (tempCurrentStreams.audio.tracks.length > 0) ? tempCurrentStreams.audio.tracks[0].pid :-1
    tempCurrentStreams.subtitles.currentStream = -1 // initiallty, there is none

    return tempCurrentStreams

  }

  playStream(metadata: any, url: string, evt: any) {
    const currentStreams = this.processStreams(metadata.streams, url)
    console.log('currentStreams', currentStreams)
    console.log('audio', currentStreams.audio.tracks)
    this.playUrl(currentStreams.url, currentStreams, evt)
  }

  close() {
    this.currentPipeline && this.currentPipeline.kill()
    this.segmentInterval && clearInterval(this.segmentInterval)
  }
}
