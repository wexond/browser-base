const ffmpeg = require('fluent-ffmpeg')
const ffmpegStatic  = require ('ffmpeg-static')
const os = require('os')

// TODO move this code in ffprobe-static
let ffmpegPath = ffmpegStatic.path
if( os.platform() === 'linux') {
    ffmpegPath = ffmpegPath.replace('app.asar', 'app.asar.unpacked')
}
ffmpeg.setFfmpegPath(ffmpegPath)


function mapstreams(videoStream,audioStream,subtitleStream){
    console.log('videoStream',videoStream)
    console.log('audioStream',audioStream)
    console.log('subtitleStream',subtitleStream)
    console.log('subtitleStream>=0',subtitleStream>=0)
    return (subtitleStream<0)?['-map 0:'+videoStream, '-map 0:'+audioStream]: ' -filter_complex "[0:v][0:'+subtitleStream+']overlay[v]" -map "[v]" -map 0:'+audioStream
    // return (subtitleStream>-1)?['-map 0:'+videoStream, '-map 0:'+audioStream]: ' -filter_complex "[0:v][0:s:1]overlay[v]" -map "[v]" -map 0:a:0'
}

function initializeVideoCmd(input){
     return ffmpeg()
            .input(input)
            .inputOptions('-probesize 700k')
            .audioCodec('aac')
            .outputOptions('-preset ultrafast')
            .outputOptions('-g 30')
            .outputOptions('-tune zerolatency')
            // .outputOptions('-flush_packets -1')
}
function initializeAudioCmd(input){
    return ffmpeg()
        .input(input)
}
function _appendCmdWithoutSubtitle(ffmpegCmd,videoStream,inputvideoCodec,audioStream){
    let newCmd
    if (process.platform === 'darwin') {
         newCmd = ffmpegCmd.videoCodec( 'libx264')
    }
    else {
         newCmd = ffmpegCmd.videoCodec( inputvideoCodec == 'h264' ? 'copy' : 'libx264')
    }

    // let newCmd = ffmpegCmd.videoCodec( inputvideoCodec == 'h264' ? 'copy' : 'libx264')
    if(audioStream && audioStream>-1){
        newCmd = newCmd.outputOptions(['-map 0:'+videoStream, '-map 0:'+audioStream+'?'])
    } 
    else {
        newCmd = newCmd.input("anullsrc")
                       .inputFormat('lavfi')
                        // .videoFilters('yadif') //entrelacement

    }
    return newCmd
}

function _appendCmdWithSubtitle(ffmpegCmd,videoStream,audioStream,subtitleStream){

//     ffmpegCmd.complexFilter('[0:v][0:'+subtitleStream+']overlay[v]" -map "[v]"')

//     .outputOptions('-preset ultrafast')
    return ffmpegCmd.outputOptions(['-filter_complex [0:v][0:'+subtitleStream+']overlay[v]','-map [v]','-map 0:'+audioStream+'?'])
    // ffmpegCmd.outputOptions(['-filter_complex "[0:v][0:'+subtitleStream+']overlay[v]" -map "[v]"',' -map 0:'+audioStream])
}

function getVideoMpegtsPipeline(input, audioStream,videoStream, inputvideoCodec,subtitleStream,isDeinterlacingEnabled,handleConversionError,handleErroneousStreamError) {
    if((process.platform === 'darwin')){
        input += '?fifo_size=13160&overrun_nonfatal=1&buffer_size=/18800&pkt_size=188'
    }
    console.log('run url: ',input)
    let ffmpegCmd = initializeVideoCmd(input)

    if (subtitleStream && subtitleStream>-1){
        console.log('-------- _appendCmdWithSubtitle')
        ffmpegCmd= _appendCmdWithSubtitle(ffmpegCmd,videoStream,audioStream,subtitleStream)
    } else {
        console.log('-------- _appendCmdWithoutSubtitle')
       ffmpegCmd = _appendCmdWithoutSubtitle(ffmpegCmd,videoStream,inputvideoCodec,audioStream)
    }

    if(isDeinterlacingEnabled){
        console.log(" force deinterlacing")
        ffmpegCmd.videoCodec( 'libx264')
        ffmpegCmd.videoFilters('yadif') 
    }

    if (process.platform === 'darwin') {
         ffmpegCmd.videoFilters('yadif') //entrelacement
        console.log("is MAC, no need to flush packets")
    }  else {
        ffmpegCmd.outputOptions('-flush_packets -1')
    }

    // return ffmpegCmd.outputOptions('-flush_packets -1')
        return ffmpegCmd.format('mp4')
            // .outputOptions('-movflags frag_keyframe+empty_moov+default_base_moof')
            .outputOptions('-movflags empty_moov+omit_tfhd_offset+frag_keyframe+default_base_moof')
            .on('start', function(commandLine) {
                console.log('Spawned Ffmpeg with command: ' + commandLine );
            })
            .on('error', (err, stdout, stderr) => {
                console.log('_________err'+ new Date(), err, stdout, stderr)
                if(stderr.indexOf("Conversion failed")>-1){
                    handleConversionError()
                } else if(stderr.indexOf('Stream specifier')>-1){
                    handleErroneousStreamError()
                }
            })
            .on('stderr', (stderr) => {
                // console.log(stderr)
            })
}

function getAudioMpegtsPipeline(input, handleConversionError, handleErroneousStreamError) {
    if (process.platform === 'darwin') {
        // input += '?fifo_size=13160&overrun_nonfatal=1&buffer_size=/18800&pkt_size=188'
    }
    console.log('run url: ', input)
    const ffmpegCmd = initializeAudioCmd(input)
    return ffmpegCmd.format('mp3')
        .on('start', commandLine => {
            console.log('Spawned Ffmpeg with command: ' + commandLine)
        })
        .on('error', (err, stdout, stderr) => {
            console.log('_________err' + new Date(), err, stdout, stderr)
            if (stderr.indexOf('Conversion failed') > - 1) {
                handleConversionError()
            } else if (stderr.indexOf('Stream specifier') > - 1) {
                handleErroneousStreamError()
            }
        })
        .on('stderr', (stderr) => {
            console.log(stderr)
        })
}

exports.getVideoMpegtsPipeline = getVideoMpegtsPipeline
exports.getAudioMpegtsPipeline = getAudioMpegtsPipeline
