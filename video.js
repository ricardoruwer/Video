!(function () {
    this.Video = function ()
    {
        this.el = document.querySelector(arguments[0]);
        if ( ! this.el) return false;

        this.youtubeToken = arguments[1].youtubeToken;

        this.init();
    }

    Video.prototype.init = function ()
    {
        this.addEvents();
    }

    Video.prototype.addEvents = function ()
    {
        var self = this;

        this.el.onchange = function (event)
        {
            document.querySelector('.js-video-output').innerHTML = '';

            var link = event.srcElement.value;

            if (link.indexOf('youtu') > -1) {
                videoYoutube(link, self.youtubeToken);
            } else if (link.indexOf('facebook') > -1) {
                videoFacebook(link);
            } else if (link.indexOf('vimeo') > -1) {
                videoVimeo(link);
            }
        }
    }

    function videoYoutube (link, token)
    {
        if (link.indexOf('youtu.be') > -1) { //youtu.br/ID
            var n = link.lastIndexOf('/');
            var video_id = link.substring(n + 1);
        } else { //youtube.com/watch?v=ID
            var n = link.indexOf('v=');
            var video_id = link.substring(n + 2);

            if (video_id.indexOf('&') > -1) {
                video_id = video_id.substring(0, video_id.indexOf('&'));
            }
        }

        var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id='
            + video_id +
            '&key=' + token;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function ()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var response = JSON.parse(xmlhttp.responseText);

                var publishedAt = response.items[0].snippet.publishedAt;
                publishedAt = publishedAt.substring(0, publishedAt.indexOf('T'));
                publishedAt = publishedAt.split('-').reverse().join('/');

                videoOutput(
                    'http://img.youtube.com/vi/' + video_id + '/hqdefault.jpg',
                    response.items[0].snippet.title,
                    response.items[0].snippet.description,
                    publishedAt
                );
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    function videoFacebook (link)
    {
        var video_id = link.match(/\d+/)[0];

        var url = "https://graph.facebook.com/" + video_id;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function ()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var response = JSON.parse(xmlhttp.responseText);

                var publishedAt = response.created_time;
                publishedAt = publishedAt.substring(0, publishedAt.indexOf('T'));
                publishedAt = publishedAt.split('-').reverse().join('/');

                videoOutput(
                    response.picture,
                    response.from.name,
                    response.description,
                    publishedAt
                );
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    function videoVimeo (link)
    {
        var video_id = link.match(/\d+/)[0];

        var url = "https://vimeo.com/api/v2/video/" + video_id + ".json";

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function ()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var response = JSON.parse(xmlhttp.responseText);

                var publishedAt = response[0].upload_date;
                publishedAt = publishedAt.substring(0, publishedAt.indexOf(' '));
                publishedAt = publishedAt.split('-').reverse().join('/');

                videoOutput(
                    response[0].thumbnail_medium,
                    response[0].title,
                    response[0].description,
                    publishedAt
                );
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    function videoOutput (the_image, the_title, the_description, the_date)
    {
        //the row
        var row = document.createElement('div');
        row.setAttribute('class', 'row');

        //the first col (image)
        var first_col = document.createElement('div');
        first_col.setAttribute('class', 'col-md-3');
        row.appendChild(first_col);

        var image = document.createElement('img');
        image.setAttribute('class', 'img-responsive');
        image.setAttribute('src', the_image);
        first_col.appendChild(image);

        //the second col (descriptions)
        var second_col = document.createElement('div');
        second_col.setAttribute('class', 'col-md-9');
        row.appendChild(second_col);

        var title = document.createElement('h4');
        title.innerHTML = the_title;
        second_col.appendChild(title);

        var description = document.createElement('p');
        description.innerHTML = the_description;
        second_col.appendChild(description);

        var date = document.createElement('p');
        date.innerHTML = 'Publicado em: ' + the_date;
        second_col.appendChild(date);

        //output
        document.querySelector('.js-video-output').appendChild(row);
    }
}());
