'use strict';
const versions = {
  1: {
    steps: [
      ['Open the registration form', 'Choose “Try version 1” to open the individual Microsoft Form. Sign in if the form requires it.'],
      ['Enter participant details', 'Complete the name, roll number, email, event, date, and other fields shown in the live form. Use an email inbox you can access.'],
      ['Choose participation status', 'Select Yes if you participated, or No if you did not. Submit the response once.'],
      ['Check your email', 'When the connected flow processes the response, participants receive an HTML certificate. Non-participants receive an update without a certificate.']
    ],
    note: 'Keep the HTML attachment to view or print your certificate. Check spam if the email is missing.',
    link: 'https://forms.cloud.microsoft/r/B378DcdeTQ', label: 'Open version 1 form ↗'
  },
  2: {
    steps: [
      ['Download the Excel template', 'Use the official template below. Keep the column names and the Excel table name ParticipantsTable unchanged.'],
      ['Fill your participant list', 'Add each person’s name, roll number, email, event, organizer name, organizer title, date, and participation status. Replace or remove the example rows.'],
      ['Upload through the form', 'Enter the uploader’s name, review the sample, and attach your completed .xlsx file. Use one status per row: Yes or No, following current form instructions.'],
      ['Let the flow process the list', 'The automation reads each row, adds master records, and sends personalized certificates or non-participation updates based on the status.']
    ],
    note: 'Use real dates and one status value per row. “Yes/No” in the sample is a placeholder, not a valid final choice. Uploads may require organization sign-in.',
    link: 'assets/CertiFlow_Participant_Template.xlsx', label: 'Download upload template ↓', download: true
  }
};
function selectVersion(value, scroll = false) {
  const data = versions[value];
  document.querySelectorAll('[data-version]').forEach(button => {
    const selected = button.dataset.version === String(value);
    button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1;
  });
  const content = document.querySelector('#guide-content');
  content.setAttribute('aria-labelledby', 'tab' + value);
  content.replaceChildren();
  const list = document.createElement('ol'); list.className = 'guide-steps';
  data.steps.forEach(([title, text]) => {
    const item = document.createElement('li'), heading = document.createElement('h4'), paragraph = document.createElement('p');
    heading.textContent = title; paragraph.textContent = text; item.append(heading, paragraph); list.append(item);
  });
  const foot = document.createElement('div'); foot.className = 'guide-foot';
  const note = document.createElement('span'); note.textContent = data.note;
  const link = document.createElement('a'); link.href = data.link; link.textContent = data.label;
  if (data.download) link.download = ''; else { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  foot.append(note, link); content.append(list, foot);
  if(scroll) document.querySelector('#guide').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
document.querySelectorAll('[data-version]').forEach(button => button.addEventListener('click', () => selectVersion(button.dataset.version)));
document.querySelectorAll('[data-select-version]').forEach(button => button.addEventListener('click', () => selectVersion(button.dataset.selectVersion,true)));
document.querySelector('[role="tablist"]').addEventListener('keydown', event => {
  if (['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
    event.preventDefault();
    const version = event.key === 'Home' ? 1 : event.key === 'End' ? 2 : document.querySelector('#tab1').getAttribute('aria-selected') === 'true' ? 2 : 1;
    selectVersion(version); document.querySelector('#tab' + version).focus();
  }
});
selectVersion(1);
const stages = [
 ['F','forms','Microsoft Forms','The starting point for every record.','Version 1 captures an individual participant’s details. Version 2 collects the organizer’s name and an uploaded Excel participant list.','Two entry points. The same purpose: structured event data.'],
 ['X','excel','Excel','Structured data, ready to process.','Version 1 stores responses and supports participation reporting. Version 2 reads ParticipantsTable from the uploaded workbook and adds participant rows to a master table.','A consistent template keeps bulk submissions predictable.'],
 ['↗','automate','Power Automate','The logic at the heart of CertiFlow.','The flow reads participant details, checks participation status, creates a personalized HTML certificate for eligible participants, and coordinates storage, email, and tracking.','A separate branch sends a notification without a certificate.'],
 ['S','sharepoint','SharePoint','A home for certificates and records.','Document libraries store generated certificate files. SharePoint list entries track participant details and certificate links when a certificate is issued.','Stored outputs make the process easier to review.'],
 ['O','outlook','Outlook','A personal message for every outcome.','Eligible participants receive an email with their HTML certificate attached. Non-participants receive a separate participation update without an attachment.','Version 2 adds redesigned messages and organizer details.']
];
function showStage(index) {
 const [mark,color,tool,title,text,note] = stages[index];
 document.querySelectorAll('[data-stage]').forEach(b=>{const on=Number(b.dataset.stage)===index;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
 const panel=document.querySelector('#flow-detail'); panel.replaceChildren();
 const icon=document.createElement('span');icon.className='tool-icon '+color;icon.textContent=mark;
 const label=document.createElement('p');label.className='eyebrow';label.textContent=tool.toUpperCase();
 const heading=document.createElement('h3');heading.textContent=title;
 const paragraph=document.createElement('p');paragraph.textContent=text;
 const detail=document.createElement('p');detail.className='flow-note';detail.textContent=note;
 panel.append(icon,label,heading,paragraph,detail);panel.classList.remove('reveal');void panel.offsetWidth;panel.classList.add('reveal');
}
document.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',()=>showStage(Number(b.dataset.stage))));showStage(0);
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.textContent=open?'✕':'☰';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');menu.textContent='☰';}));
const dialog=document.querySelector('#media-dialog'),media=document.querySelector('#media-content'),title=document.querySelector('#media-title');
document.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',()=>{
 const version=button.dataset.video;title.textContent='CertiFlow '+version+' · Full walkthrough';media.replaceChildren();
 const video=document.createElement('video');video.controls=true;video.preload='metadata';video.playsInline=true;video.className='dialog-video';
 video.src=version==='1'?'project-files/certiflow_1/certiflow1_video.mp4':'project-files/certiflow_2/certiflow_1_video.mp4';
 media.append(video);dialog.showModal();
}));
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{
 title.textContent=button.dataset.caption;media.replaceChildren();const image=document.createElement('img');image.src=button.dataset.image;image.alt=button.dataset.caption;image.className='dialog-image';media.append(image);dialog.showModal();
}));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{const video=media.querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load();}media.replaceChildren();});
