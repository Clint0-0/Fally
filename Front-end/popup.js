const kidMode = document.getElementById("kidMode");
const parentalControl = document.getElementById("parentalControl");
const changePasswordBtn = document.getElementById("changePassword");

/* -------------------- */
/* DEFAULT PASSWORD */
/* -------------------- */

chrome.storage.local.get(["password"], (data)=>{

  if(!data.password){
    chrome.storage.local.set({password:"1234"});
  }

});

/* -------------------- */
/* LOAD SETTINGS */
/* -------------------- */

chrome.storage.local.get(["kidMode","parentalControl"], (data)=>{

  kidMode.checked = data.kidMode || false;
  parentalControl.checked = data.parentalControl || false;

});


/* -------------------- */
/* KID MODE */
/* -------------------- */

kidMode.addEventListener("change",()=>{

  chrome.storage.local.get(["parentalControl","password"], (data)=>{

    if(data.parentalControl){

      const pass = prompt("Enter parental password");

      if(pass !== data.password){

        alert("Wrong password");
        kidMode.checked = !kidMode.checked;
        return;

      }

    }

    chrome.storage.local.set({kidMode:kidMode.checked});

  });

});


/* -------------------- */
/* PARENTAL CONTROL */
/* -------------------- */

parentalControl.addEventListener("change",()=>{

  chrome.storage.local.get(["password"], (data)=>{

    if(!parentalControl.checked){

      const pass = prompt("Enter parental password");

      if(pass !== data.password){

        alert("Wrong password");
        parentalControl.checked = true;
        return;

      }

    }

    chrome.storage.local.set({parentalControl:parentalControl.checked});

  });

});


/* -------------------- */
/* CHANGE PASSWORD */
/* -------------------- */

changePasswordBtn.addEventListener("click", ()=>{

  chrome.storage.local.get(["password"], (data)=>{

    const current = prompt("Enter current password");

    if(current !== data.password){
      alert("Wrong password");
      return;
    }

    const newPass = prompt("Enter new password");

    if(!newPass || newPass.length < 3){
      alert("Password must be at least 3 characters");
      return;
    }

    chrome.storage.local.set({password:newPass});

    alert("Password changed successfully");

  });

});


/* -------------------- */
/* RESCAN PAGE */
/* -------------------- */

document.getElementById("scanBtn").addEventListener("click", () => {

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

    chrome.tabs.reload(tabs[0].id);

  });

});