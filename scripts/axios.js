axios.defaults.baseURL = 'https://music.hzbiz.net/';
axios.defaults.withCredentials = true;

$('#qr').on('click', function (e) {

    // console.log(e);
    var url = 'login/qr/key?e=' + (new Date());
    var info = $(this).serializeArray();
    var params = {};

    // console.log('asd'+info);
    axios.post(url, params)
        .then(res => {
            console.log(res.data.data.unikey);

            // Create Qr Code
            var url = 'login/qr/create?e=' + (new Date());
            var params = {
                key: res.data.data.unikey,
                qrimg: 1
            };

            axios.post(url, params)
                .then(res => {
                    console.log(res.data.data.qrimg)
                    var qr = $('<img src="' + res.data.data.qrimg + '">');
                    $('.qr').append(qr);

                })
                .catch(err => {
                    console.error(err);
                })

            // check QrScanning status
            function checkStatus(res) {
                var url = 'login/qr/check?e=' + (new Date());
                var params = {
                    key: res.data.data.unikey
                };

                axios.post(url, params)
                    .then(res => {
                        console.log(res.data.code);
                        if (res.data.code == '803') {
                            clearInterval(timeId);

                            var url = 'login/refresh?e=' + (new Date());
                            axios.post(url)
                                .then(res => {
                                    console.log(res)
                                })
                                .catch(err => {
                                    console.error(err);
                                })
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    })
            }

            const timeId = setInterval(() => {
                checkStatus(res);
                // console.log('turn');
            }, 1000);
        })
        .catch(err => {
            console.error(err);
        })
        .catch(err => {
            console.error(err);
        })
})


$('#login').on('submit', function (e) {
    e.preventDefault();
    var url = $(this).attr('action') + '?e=' + (+new Date());
    var info = $(this).serializeArray();
    var params = {
        phone: info[0].value,
        password: info[1].value
    }

    // console.log(params[0].value);
    axios.post(url, params)
        .then(res => {
            console.log(res);
            var avatar = $('<img src="' + res.data.profile.avatarUrl + '">')
            $('main').append(avatar);

            var songListUrl = 'user/playlist';
            var uId = {
                uid: res.data.profile.userId
            };


            axios.post(songListUrl, uId)
                .then(res => {
                    console.log(res.data.playlist);

                    for (let index = 0; index < res.data.playlist.length; index++) {
                        var songList = $('<li>' + res.data.playlist[index].name + '</li>')
                        $('.songList').append(songList);
                    }

                    var url = 'playlist/detail';
                    var params = {
                        id: res.data.playlist[0].id
                    };
                    axios.post(url, params)
                        .then(res => {
                            console.log(res.data.playlist.trackIds[0].id)
                            var url = 'song/url';
                            var params = {
                                id: res.data.playlist.trackIds[30].id
                            }

                            axios.post(url, params)
                                .then(res => {
                                    console.log(res);
                                    var player = $('<audio controls><source src = ' +
                                        res.data.data[0].url + '/></audio>')
                                    $('main').append(player);
                                })
                                .catch(err => {
                                    console.error(err);
                                })
                        })
                        .catch(err => {
                            console.error(err);
                        })
                })
                .catch(err => {
                    console.error(err);
                })
        })
        .catch(err => {
            console.error(err);
        })


})