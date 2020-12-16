var darkMode;
if (localStorage.getItem('dark-mode')) { 
  darkMode = localStorage.getItem('dark-mode'); 
  if(darkMode=="dark"){
    document.body.classList.add('dark-mode');
    document.getElementById('dms').checked=true;
    Array.from(document.getElementsByTagName("thead")).forEach((el)=>{
        el.classList.replace("thead-light","thead-dark")
    });
  }else{
    document.body.classList.remove('dark-mode');
    document.getElementById('dms').checked=false;
    Array.from(document.getElementsByTagName("thead")).forEach((el)=>{
        el.classList.replace("thead-dark","thead-light")
    });
  }
}else { 
  darkMode = "light"; 
  document.body.classList.remove('dark-mode');
  document.getElementById('dms').checked=false;
}
localStorage.setItem('dark-mode', darkMode);

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  darkMode = localStorage.getItem('dark-mode')=="light"?"dark":"light";
    Array.from(document.getElementsByTagName("thead")).forEach((el)=>{
        if(darkMode=="dark"){
            el.classList.replace("thead-light","thead-dark")
        }else{
            el.classList.replace("thead-dark","thead-light")
        }
    });
  localStorage.setItem('dark-mode',darkMode);
}