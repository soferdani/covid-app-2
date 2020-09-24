class APIManager {
    constructor() {
        this.data = []
        this.status = ''
        this.countryName = ''
    }

    async getStats(countryName, from, to) {
        this.data = await $.get(`/stats/${countryName}?from=${from}&to=${to}`)
    }

    async saveUser(name, email, date, status) {
        let dataToRouts = { name, email, date, status }
        const res = await $.post('/saveUser', dataToRouts)
        const sendTheMail = await $.post('/sendMail', dataToRouts)
    }

    async getWorldStats() {
        this.worldStats = await $.get(`/infoForCharts1`)
    }


    async getNews() {
        this.news = await $.get(`/news`)
    }

    async getCountryStats() {
        this.CountryStats = await $.get(`/infoForCharts2`)

    }

    calculaturQue(text) {
        if (text === 'I was exposed to a verified patient') {
            return ['For how long?', 'More than 15 minutes', 'Less than 15 minutes']
        }
        if (text === 'More than 15 minutes') {
            return ['where?', 'Close space', 'Open space']
        }
        if (text === 'Less than 15 minutes') {
            this.status = "healthy"
            return ['We got results! Please submit your info for answers', '', '']
        }
        if (text === 'Close space') {
            this.status = "exposed"
            return ['We got results! Please submit your info and date of exposer for answers', '', '']
        }
        if (text === 'Open space') {
            this.status = "healthy"
            return ['We got results! Please submit your info for answers', '', '']
        }

        if (text === "I'm not feeling well") {
            return ['Whats your temprature?', 'More than 38 degrees', 'Less than 38 degrees']
        }
        if (text === 'More than 38 degrees') {
            this.status = "symptoms"
            return ['We got results! Please submit your info for answers', '', '']
        }
        if (text === 'Less than 38 degrees') {
            this.status = "healthy"
            return ['We got results! Please submit your info for answers', '', '']
        }

        if (text === "I returned from abroad") {
            this.status = "abroad"
            return ['We got results! Please submit your info and date of exposer for answers', '', '']
        }

        if (text === "I'm a verified corona patient") {
            return ['Do you have symptoms?', 'Yes', 'No']
        }
        if (text === 'Yes') {
            this.status = "sick with symptoms"
            return ['We got results! Please submit your info for answers', '', '']
        }
        if (text === 'No') {
            this.status = "sick with out symptoms"
            return ['We got results! Please submit your info for answers', '', '']
        }

    }


    createChart() {
        let ctx = $('#myChart')
        const prettyDates = this.data[0].map(d => moment(d).format('L'))

        let myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: prettyDates,
                datasets: [{
                    label: 'Death',
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: this.data[1]
                }, {
                    label: 'Active',
                    fill: false,
                    backgroundColor: 'rgb(25, 181, 254)',
                    borderColor: 'rgb(41, 128, 185)',
                    data: this.data[2]
                }]
            },

            options: {}
        });
    }


    createCarthForCharPage() {
        let info = this.CountryStats
        let activeArry = info.map(a => a.active)
        let countryArry = info.map(a => a.name)

        const diagramHtml = $('#diagram')
        let barCharts = new Chart(diagramHtml, {
            type: "bar",
            data: {
                labels: countryArry,
                datasets: [{
                    label: 'Active Patients',
                    data: activeArry,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        })

    }

    async getLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject)
            }
        })
    }

    async getCurrentCountry() {
        const position = await this.getLocation()
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        const data = await $.get(`/location/${lat}/${lon}`)
        return data

    }

    async getUsersInfoFromDB() {
        let userDataFromDB = await $.get(`/userStats`)
        let pieDiagramHtml = $('#userPie')
        let pushToChart = {
            labels: [
                "abroad",
                "exposed",
                "healthy",
                "sick",
                "symptoms"
            ],
            datasets: [
                {
                    data: [
                        userDataFromDB.abroad,
                        userDataFromDB.exposed,
                        userDataFromDB.healthy,
                        userDataFromDB.sick,
                        userDataFromDB.symptoms
                    ],
                    backgroundColor: [
                        "#7E349D",
                        "#07ABA0",
                        "#E3724B",
                        "#F1C40F",
                        "#61afef"
                    ]
                }]
        };
        const pieChart = new Chart(pieDiagramHtml, {
            type: 'pie',
            data: pushToChart
        });
    }

    checkValid(name, email){
        if(!name || !email){
            return false
        }
        return true
    }
}

