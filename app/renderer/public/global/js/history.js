function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

var jsonObj = getHistoryData();
var dates = [];
var cards = [];
var items = [];

var checkedCount = 0;

$('#unselect-btn').click(unSelectAll);
$('#cancel-btn').click(unSelectAll);

function unSelectAll() {
    $('.checkbox').each(function (i) {
        this.instance.checked = false;
    });
}

$('.icon-button').mousedown(function () {
    Ripple.makeRipple($(this), $(this).width() / 2, $(this).height() / 2, $(this).height(), $(this).width(), 300, 0, "#fff");
});

$('#delete-btn').click(function () {
    $('.item').each(function () {
        if (this.list.checkbox[0].instance.checked) {
            var i = $('.item').index($(this));
            $(this).remove();
            checkedCount = 0;
            verifyCheckboxes();
            console.log(i);
            jsonObj.history.reverse();
            jsonObj.history.splice(i, 1);
            jsonObj.history.sort(function (a, b) {
                return parseFloat(a.id) - parseFloat(b.id);
            });
            removeHistory(function () {
                saveHistory(JSON.stringify(jsonObj));
            });
        }

        if (this.list.card.find('.item').length == 0) {
            this.list.card.remove();
        };
    });


});

$('.flat-button').mousedown(function (e) {
    var relX = e.pageX - $(this).offset().left;
    var relY = e.pageY - $(this).offset().top;
    Ripple.makeRipple($(this), relX, relY, $(this).height() + 16, $(this).width() + 16, 300, 0, "#fff");
});

function verifyCheckboxes() {
    if (checkedCount > 0) {
        $('.selected-items-text').html('Selected items: ' + checkedCount);
        $('.selected').css({
            display: 'block'
        }).animate({
            opacity: 1
        }, {
            duration: 150,
            queue: false
        });
    } else {
        $('.selected').animate({
            opacity: 0
        }, {
            duration: 150,
            queue: false,
            complete: function () {
                $(this).css({
                    display: 'none'
                });
            }
        });
    }
}

$('.search-input').on('input', function () {
    if ($(this).val() == "") {
        $('.hint').css('visibility', 'visible');
    } else {
        $('.hint').css('visibility', 'hidden');
    }
    $('.content').empty();
    dates = [];
    cards = [];
    items = [];
    loadHistory($(this).val());
    checkedCount = 0;
});

function loadHistory(search = "") {

    $.each(jsonObj.history, function (i, el) {
        if (!isInArray(jsonObj.history[i].date, dates)) {
            dates.push(jsonObj.history[i].date);
        }
    });
    dates.reverse();
    for (var i2 = 0; i2 < dates.length; i2++) {
        var d = new Date(dates[i2]);
        var date = d.toString();
        var dayOfWeek = date.split(" ")[0];
        var month = date.split(" ")[1];
        var dayOfMonth = date.split(" ")[2];
        var year = date.split(" ")[3];

        var card = $('<div class="card">').appendTo($('.content'));
        var header = $('<div class="header">').appendTo(card);
        var line = $('<div class="line">').appendTo(card);
        var body = $('<div class="body">').appendTo(card);
        var items = $('<div class="items">').appendTo(body);

        if (month == "Jan") {
            month = "January";
        }
        if (month == "Feb") {
            month = "February";
        }
        if (month == "Mar") {
            month = "March";
        }
        if (month == "Apr") {
            month = "April";
        }
        if (month == "Jun") {
            month = "June";
        }
        if (month == "Jul") {
            month = "July";
        }
        if (month == "Aug") {
            month = "August";
        }
        if (month == "Sep") {
            month = "September";
        }
        if (month == "Oct") {
            month = "October";
        }
        if (month == "Nov") {
            month = "November";
        }
        if (month == "Dec") {
            month = "December";
        }

        if (dayOfMonth.slice(-1) == "1") {
            dayOfMonth += "st";
        } else {
            if (dayOfMonth.slice(-1) == "2") {
                dayOfMonth += "nd";
            } else {
                if (dayOfMonth.slice(-1) == "3") {
                    dayOfMonth += "rd";
                } else {
                    dayOfMonth += "th";
                }
            }
        }

        var d1 = Date();
        var todayDate = d1.toString();

        if (todayDate.split(" ")[1] == date.split(" ")[1] && todayDate.split(" ")[2] == date.split(" ")[2]) {
            header.html("Today - " + dayOfMonth + " of " + month);
        } else {
            header.html(dayOfMonth + " of " + month);
        }
        card[0].list = {
            card: card,
            header: header,
            line: line,
            body: body,
            items: items,
            date: date
        };
        cards.push(card);


        for (var i = jsonObj.history.length - 1; i >= 0; i--) {
            var d2 = new Date(jsonObj.history[i].date);
            var date1 = d2.toString();
            if (date.split(" ")[1] == date1.split(" ")[1] && date.split(" ")[2] == date1.split(" ")[2]) {
                if (search == "") {
                    addItem(card, i);
                } else {
                    if (jsonObj.history[i].link.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
                        addItem(card, i);
                    }
                }
            }
        }

    }
    console.log($('.card .item').length);
    $('.card').each(function (i) {
        if ($(this).find('.item').length <= 1) {
            $(this).remove();
        }
    });

}

function addItem(card, i) {
    var item = $('<div class="item">').appendTo(card.find('.items'));
    item.append('\
                <div class="checkbox ripple-icon" data-ripple-color="#757575"></div>\
                <div class="details">\
                    <div class="time"></div>\
                    <div class="page-title"></div>\
                    <a class="link" href=""></a>\
                </div>\
                ');
    var checkbox = item.find('.checkbox');
    var details = item.find('.details');
    var time = item.find('.time');
    var pageTitle = item.find('.page-title');
    var link = item.find('.link');
    link.attr('href', jsonObj.history[i].link);

    checkbox[0].instance = checkbox.checkbox();

    checkbox.on('checked-changed', function (e, data) {
        if (data.checked) {
            checkedCount += 1;
        } else {
            checkedCount -= 1;
        }
        verifyCheckboxes();
    });

    var timeObj = new Date();
    timeObj.setHours(jsonObj.history[i].time.split(":")[0], jsonObj.history[i].time.split(":")[1], 0, 0);
    var time1 = timeObj.toString();

    var timeString = time1.split(" ")[4].split(":")[0] + ":" + time1.split(" ")[4].split(":")[1];

    link.html(jsonObj.history[i].link);
    pageTitle.html(jsonObj.history[i].title);
    time.html(timeString);

    item[0].list = {
        item: item,
        checkbox: checkbox,
        details: details,
        time: time,
        pageTitle: pageTitle,
        link: link,
        card: card,
        id: jsonObj.history[i].id
    };

    items.push(item);
}
loadHistory();

setInterval(function () {
    if ($(window).width() < 1024) {
        $('.center').css({
            width: 'calc(100% - 64px)',
            marginLeft: 32,
            marginRight: 32
        });
        $('.content').css({
            width: 'calc(100% - 48px)',
            marginLeft: 24,
            marginRight: 24,
            marginBottom: 24
        });
    } else {
        $('.center').css({
            width: '85%',
            maxWidth: 1024 - 64,
            marginLeft: 'auto',
            marginRight: 'auto'
        });
        $('.content').css({
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 24
        });
    }
}, 1);
