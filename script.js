const videoPage = document.querySelector(".video-page");

const searchButton = document.querySelector(".search-button");
const searchInput = document.querySelector(".search-actual-input");

const themeChanger = document.getElementById("theme-changer");

const customNav = document.querySelector("custom-navbar");
// console.log(videoPage);

const API_KEY = "AIzaSyDYAvj0j62CqaEaJ4guAu20yn6AlNhhqAE";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

async function searchVideos(searchQuery) {
  console.log(searchQuery);
  if (searchQuery == "" || searchQuery == undefined) {
    document.title = "Youtube";
  } else {
    document.title = `${searchQuery} - Youtube`;
  }

  try {
    let url = `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&part=snippet&maxResults=30`;
    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();
    console.log(data.items);
    videoPage.innerHTML = "";
    displayVideo(data.items);
  } catch (err) {
    console.log(err);
  }
}

function displayVideo(data) {
  data.map(async (item) => {
    // console.log(item.snippet.channelId);

    const channedInfo = await channelDetails(item.snippet.channelId);

    const channelThumbnail = channedInfo.items[0].snippet.thumbnails.high.url;

    const videoInfo = await videoDetailS(item.id.videoId);

    const publishDate = displayDate(videoInfo.items[0].snippet.publishedAt);

    const viewsData = converViews(videoInfo.items[0].statistics.viewCount);

    const videoDiv = document.createElement("div");
    videoDiv.className = "video";
    videoDiv.addEventListener("click", () => {
      openVideo(item);
    });
    videoDiv.innerHTML = `<div class="thumbnail">
    <img
      src= ${item.snippet.thumbnails.high.url}
      alt=""
      width="100%"
      
    />
  </div>
  <div class="title">
    <div class="channel-profile">
      <div class="channel">
        <img
          src=${channelThumbnail}
          alt=""
          width="100%"
          style="border-radius: 50%"
        />
      </div>
    </div>
    <div class="video-desc">
      <div class="video-info">
        ${item.snippet.title}
      </div>

      <div class="channel-name">
        <h3>${item.snippet.channelTitle}</h3>
        <h2>${viewsData} views · ${publishDate}</h2>
      </div>`;

    videoPage.appendChild(videoDiv);
  });
}

async function videoDetailS(videoId) {
  try {
    let url = `${BASE_URL}/videos?key=${API_KEY}&part=snippet,contentDetails,statistics&id=${videoId}`;

    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
  }
}

async function channelDetails(channel_id) {
  try {
    let url = `${BASE_URL}/channels?key=${API_KEY}&part=snippet,statistics,contentOwnerDetails&id=${channel_id}`;

    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

searchVideos(localStorage.getItem("searchFromVideo"));

// videoDetailS("IIuRc8IiSuE");

function converViews(data) {
  const abbreviations = ["", "K", "M", "B"];

  for (let i = abbreviations.length - 1; i >= 0; i--) {
    const divisor = Math.pow(10, i * 3);
    if (data >= divisor) {
      const result = (data / divisor).toFixed(1);
      return result + abbreviations[i];
    }
  }

  return data.toString();
}
function displayDate(data) {
  const millisecondsPerMinute = 60 * 1000;
  const millisecondsPerHour = 60 * millisecondsPerMinute;
  const millisecondsPerDay = 24 * millisecondsPerHour;
  const millisecondsPerMonth = 30.44 * millisecondsPerDay;
  const millisecondsPerYear = 365.25 * millisecondsPerDay;

  const start = new Date(data);
  const end = new Date();
  const timeDifference = Math.abs(end - start);

  const units = [
    { label: "year", divisor: millisecondsPerYear },
    { label: "month", divisor: millisecondsPerMonth },
    { label: "week", divisor: 7 * millisecondsPerDay },
    { label: "day", divisor: millisecondsPerDay },
    { label: "hour", divisor: millisecondsPerHour },
    { label: "minute", divisor: millisecondsPerMinute },
  ];

  for (const unit of units) {
    const value = Math.floor(timeDifference / unit.divisor);
    if (value !== 0) {
      return value + " " + (value === 1 ? unit.label : unit.label + "s") + " ago";
    }
  }

  return "just now";
}


searchButton.addEventListener("click", () => {
  // console.log(searchInput.value);

  searchVideos(searchInput.value);
});

searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") searchVideos(searchInput.value);
});

function searchFilters(event) {
  searchVideos(event.target.innerText);
}

function openVideo(item) {
  const jsonString = JSON.stringify(item);
  localStorage.setItem("videoToWatch", jsonString);
  window.location.href = "video.html";

}



//dark-mode
document.documentElement.style.setProperty("--theme-color", "#0f0f0f");

document.documentElement.style.setProperty("--theme-color-text", "#fff");

document.documentElement.style.setProperty("--theme-color-light", "#292929");

document.documentElement.style.setProperty("--theme-color-light-text", "#aaa");

document.documentElement.style.setProperty("--theme-color-hover", "#292929");

document.documentElement.style.setProperty("--theme-color-logo", "#fff");

