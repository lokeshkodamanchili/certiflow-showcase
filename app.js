'use strict';
const versions = {
  1: {logo:'assets/logo-v1.png', label:'CERTIFLOW 1', tag:'Individual', kicker:'THE ORIGINAL EXPERIENCE', title:'One form. Your certificate.', description:'Register your details and participation status. The flow emails a certificate to eligible participants.', steps:['Open the form and enter your details.','Choose your participation status and submit.','Check your email for the certificate or update.'], form:'https://forms.cloud.microsoft/r/B378DcdeTQ', video:'project-files/certiflow_1/certiflow1_video.mp4', duration:'5:50', poster:'assets/video-v1.jpg'},
  2: {logo:'assets/logo-v2.png', label:'CERTIFLOW 2', tag:'Bulk upload', kicker:'MADE FOR ORGANIZERS', title:'One spreadsheet. Your whole event.', description:'Upload an Excel participant list. The flow processes each person and emails their certificate or participation update.', steps:['Download the template and fill in participant details.','Open the form and upload your completed Excel file.','Submit once. The flow processes each participant.'], form:'https://forms.cloud.microsoft/r/1AAeEHv1w3', video:'project-files/certiflow_2/certiflow_1_video.mp4', duration:'7:28', poster:'assets/video-v2.jpg'}
};
let selectedVersion = 1;
const byId = id => document.getElementById(id);
function selectVersion(value) {
  selectedVersion = Number(value);
  const data = versions[selectedVersion];
  document.querySelectorAll('[data-version]').forEach(button => {
    const selected = Number(button.dataset.version) === selectedVersion;
    button.setAttribute('aria-selected',String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  const panel = byId('version-panel');
  panel.setAttribute('aria-labelledby','tab'+selectedVersion);
  byId('version-logo').src = data.logo;
  byId('version-logo').alt = 'Original CertiFlow version '+selectedVersion+' logo';
  byId('logo-stage').classList.toggle('v2',selectedVersion===2);
  for (const key of ['label','tag','kicker','title','description']) byId('version-'+key).textContent = data[key];
  byId('steps').replaceChildren(...data.steps.map(text => {const li=document.createElement('li');li.textContent=text;return li;}));
  const link=byId('form-link');link.href=data.form;link.replaceChildren(document.createTextNode('Try version '+selectedVersion+' '));
  const arrow=document.createElement('span');arrow.setAttribute('aria-hidden','true');arrow.textContent='↗';link.append(arrow);
  byId('duration').textContent=data.duration;
  byId('template-link').hidden=selectedVersion!==2;
  panel.classList.remove('panel-enter');void panel.offsetWidth;panel.classList.add('panel-enter');
}
document.querySelectorAll('[data-version]').forEach(button=>button.addEventListener('click',()=>selectVersion(button.dataset.version)));
document.querySelector('[role="tablist"]').addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  selectVersion(event.key==='Home'?1:event.key==='End'?2:selectedVersion===1?2:1);
  byId('tab'+selectedVersion).focus();
});
const dialog=byId('media-dialog'), video=byId('demo-video');
byId('watch-video').addEventListener('click',()=>{
  const data=versions[selectedVersion];
  byId('media-title').textContent='CertiFlow '+selectedVersion+' · Demo';
  video.src=data.video;video.poster=data.poster;video.preload='metadata';
  byId('video-direct').href=data.video;
  dialog.showModal();
});
byId('close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
dialog.addEventListener('close',()=>{video.pause();video.removeAttribute('src');video.load();});
