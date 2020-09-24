class Renderer {
    constructor() {
    }

    renderMenu() {
        const html = '<span id="delete-menu"><i class="fas fa-times"></i></span>'
        $('#menu-bar').empty().append(html)
        $('#menu-option').css('display', 'grid')
    }

    renderOfMenu() {
        const html = '<span id="menu-button"><i class="fas fa-bars"></i></span>'
        $('#menu-bar').empty().append(html)
        $('#menu-option').css('display', 'none')
    }


    renderPage(name) {
        clearInterval(this.flashNews)
        this.renderOfMenu()
        const source = $(`#${name}-template`).html()
        const template = Handlebars.compile(source)
        const newHTML = template()
        $('#page-content').empty().append(newHTML)
    }

    renderChat(text, id) {
        $('#chat').append(`<p class="chat-msg" id=${id}>${text}</p><br/><br/>`)
    }

    renderQue(res1, res2) {
        $('#answers').empty().append(`<div class="answer">${res1}</div><div class="answer">${res2}</div>`)

    }

    renderUserForm(date) {
        const source = $('#userForm-template').html()
        const template = Handlebars.compile(source)
        const newHTML = template({ date })
        $('#answers').empty().append(newHTML)
    }

    renderThankyou() {
        $('#page-content').empty().append('<div id="msg">Thank you the results will arrive soon</div>')
    }

    createChartTemplate(){
        $('#chart-template').empty().append('<canvas id="myChart" width="400" height="400"></canvas>')
    }

    renderEror() {//not working yet
        $('#chart-template').empty().append('<div id="eror">Please try diffrent country name</div>')
    }

    renderStats(worldstats) {
        const source = $(`#world-stats-template`).html()
        const template = Handlebars.compile(source)
        const newHTML = template(worldstats)
        $('#world-stats').empty().append(newHTML)
    }

    renderNewsPage(news) {
        clearInterval(this.flashNews)
        this.renderOfMenu()
        const source = $(`#news-template`).html()
        const template = Handlebars.compile(source)
        const newHTML = template(news)
        $('#page-content').empty().append(newHTML)
    }

    renderNews(news) {
        $('#news').empty().append(`<p>${news[0].title}</p>`)
        let i = 1;
        this.flashNews = setInterval(function () {
            $('#news').empty().append(`<p>${news[i].title}</p>`)
            i++
            if (i === 5) {
                i = 0
            }
        }, 4000)
    }
}