const hdBtn = document.getElementById('hd');
const descriptionBtn = document.getElementById('description--btn');
const descriptionContainer = document.querySelector('.description--container');
const descriptionText = document.querySelector('.description--text');
let apod = document.querySelector('.apod');
let main = document.querySelector('.main');
const photoTitle = document.querySelector('.photo-title');
let hdBtnText = document.querySelector('.btn--text');
let dateInput = document.querySelector('.date-input');
let spinner = document.getElementById('loading-spinner');

let sdImg = '';
let hdImg = '';
let date = new Date().toISOString().slice(0, 10);

async function getFetch(date) {
  try {
    console.log(date);
    spinner.classList.remove('hidden');

    const url = `https://api.nasa.gov/planetary/apod?api_key=i23bH6OOpSFJ4JF9wWlUI6cxoSGb39yFJGiFPcPS&date=${date} `;
    const res = await fetch(url);
    const data = await res.json();

    apod.innerHTML = '';
    renderMedia(data);
  } catch (err) {
    console.log(`error ${err}`);
    showError('Ooops! Something went wrong! Please try again!');
  }
}

function renderMedia(data) {
  photoTitle.innerText = data.title;

  if (data.media_type === 'video') {
    let element = document.createElement('iframe');
    element.src = data.url;
    apod.appendChild(element);
  } else {
    let element = document.createElement('img');
    sdImg = data.url;
    hdImg = data.hdurl;
    element.src = sdImg;
    apod.appendChild(element);
  }
  descriptionText.innerText = data.explanation;
  spinner.classList.add('hidden');
}

function showError(err) {
  document.querySelector('.apod').innerHTML = err;
}

function description() {
  if (
    apod.firstChild.nodeName === 'IMG' ||
    apod.firstChild.nodeName === 'IFRAME'
  ) {
    main.classList.toggle('active');
    apod.classList.toggle('active');
    descriptionText.classList.toggle('hidden');
  }
}

function hd() {
  document.querySelectorAll('.btn--hd').forEach((el) => {
    el.classList.toggle('hd');
  });

  hdBtnText.classList.contains('hd')
    ? (hdBtnText.textContent = 'HD')
    : (hdBtnText.textContent = 'SD');

  let img = document.querySelector('img');

  img.src === sdImg ? (img.src = hdImg) : (img.src = sdImg);
}

descriptionBtn.addEventListener('click', description);

hdBtn.addEventListener('click', hd);

function resetHD() {
  document.querySelectorAll('.btn--hd').forEach((el) => {
    el.classList.remove('hd');
  });
  hdBtnText.textContent = 'SD';
}

document.querySelector('.date-input').addEventListener('change', (e) => {
  if (main.classList.contains('active')) {
    description();
  }
  if (e.target.value > date) {
    showError('I cannot see in the future... Yet!');
  } else {
    resetHD();
    getFetch(e.target.value);
  }
});

dateInput.value = '';
getFetch(date);
