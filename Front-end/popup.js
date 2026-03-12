const PASSWORD = "1234";

const kidMode = document.getElementById("kidMode");
const parentalControl = document.getElementById("parentalControl");

chrome.storage.local.get(["kidMode","parentalControl"], (data)=>{

  kidMode.checked = data.kidMode || false;
  parentalControl.checked = data.parentalControl || false;

});


kidMode.addEventListener("change",()=>{

  chrome.storage.local.get(["parentalControl"], (data)=>{

    if(data.parentalControl){

      const pass = prompt("Enter parental password");

      if(pass !== PASSWORD){

        alert("Wrong password");
        kidMode.checked = !kidMode.checked;
        return;

      }

    }

    chrome.storage.local.set({kidMode:kidMode.checked});

  });

});


parentalControl.addEventListener("change",()=>{

  if(!parentalControl.checked){

    const pass = prompt("Enter parental password");

    if(pass !== PASSWORD){

      alert("Wrong password");
      parentalControl.checked = true;
      return;

    }

  }

  chrome.storage.local.set({parentalControl:parentalControl.checked});

});


document.getElementById("scanBtn").addEventListener("click", () => {

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

    chrome.tabs.reload(tabs[0].id);

  });

});