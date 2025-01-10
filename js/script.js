(function () {

    // window.onload = function () {
    //
    // }

    function sendPostRequest(url) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.responseType = 'json';
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                } else {
                    // 请求失败，返回错误信息
                    reject(new Error(`Request failed with status ${xhr.status}`));
                }
            };
            xhr.onerror = function() {
                reject(new Error('Network error'));
            };
            xhr.send();
        });
    }

    var response =null;
    var swiperWrapper = document.getElementById("swiperWrapper");
    async function makePostRequest() {
        try {
            response = await sendPostRequest("https://netease-cloud-music-api-five-roan-88.vercel.app/homepage/block/page");
            if (response) {
                localStorage.setItem("response", JSON.stringify(response));
            }else {
                response = JSON.parse(localStorage.getItem("response"));
            }
            // 创建banner
            createBanners(response);
            createJGImg(response);
            createSongList(response);

        } catch (error) {
            console.error('Error:', error);
        }
    }

    function createBanners(response) {
        var banners = response.data.blocks[0].extInfo.banners
        var pics=banners.map(banner => {
            return banner.pic;
        })
        console.log(pics);
        var fragment = document.createDocumentFragment();
        pics.forEach(banner => {
            var div = document.createElement("div");
            div.className="swiper-slide";
            var img = document.createElement("img");
            img.src=banner;
            div.appendChild(img);
            fragment.appendChild(div);
        })
        console.log(fragment)
        console.log(swiperWrapper);
        swiperWrapper.appendChild(fragment);

    }

    var content = document.querySelector(".content");
    function createJGImg(response) {
        // 拿到数据
        var elements=response.data.blocks[1].creatives[0].resources;
        // 创建碎片一起传进去
        var fragment = document.createDocumentFragment();
        elements.forEach(element => {

            var div = document.createElement("div");
            var divImg = document.createElement("div");
            divImg.className="content-div-img";
            divImg.style.backgroundImage = `url(' ${element.uiElement.image.imageUrl2} ')`;
            div.appendChild(divImg);
            var divText = document.createElement("div");
            divText.className="content-div-text";
            divText.innerText = element.uiElement.mainTitle.title;
            div.appendChild(divText);
            fragment.appendChild(div);
        })
        //设置每日推荐的
        var firstDiv = fragment.querySelector(".content-div-img");
        firstDiv.classList.add("dateStyle");
        firstDiv.innerText=new Date().getDate();
        content.appendChild(fragment)

    }

    var songListParent = document.querySelector(".songList-item-parent");
    function createSongList(response) {
        // 拿到数据
        var elements=response.data.blocks[2].creatives;
        var fragment = document.createDocumentFragment();
        elements.forEach(element => {
            var songListItem = document.createElement("div");
            songListItem.className="songList-item";
            var songListShadow = document.createElement("div");
            songListShadow.className="songList-div-shadow";
            songListItem.appendChild(songListShadow);
            var songListImg = document.createElement("div");
            songListImg.className="songList-div-img";
            songListImg.style.backgroundImage = `url('${element.uiElement.image.imageUrl}')`;
            songListItem.appendChild(songListImg);
            var songListText = document.createElement("div");
            songListText.className="songList-div-text";
            songListText.innerText = element.uiElement.mainTitle.title;
            songListItem.appendChild(songListText);
            fragment.appendChild(songListItem);

        })
        songListParent.appendChild(fragment)
    }

    makePostRequest()

    var mySwiper = new Swiper('.swiper', {
        // autoplay: true,//等同于以下设
        autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
        },
    });






})(window)