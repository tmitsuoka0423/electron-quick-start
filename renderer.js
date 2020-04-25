const fs = require('fs').promises;
const sudo = require('sudo-js');

const passwordEle = document.getElementById('password');
passwordEle.addEventListener('keyup', function() {
  console.debug('password', passwordEle.value);
  sudo.setPassword(passwordEle.value);
});

const HOME = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
let lastHostFile = 'local.hosts';

function removeSelectedClass() {
  const files = document.getElementById('files').children;
  for (let i = 0; i < files.length; i++) {
    files[i].classList.remove('selected');
  }
}

console.log(`opening ${HOME}/hostly`);
fs.readdir(`${HOME}/hostly`).then((files) => {
  console.log(`${HOME}/hostly has below files, `, files);
  const filesEle = document.getElementById('files');
  
  for (const file of files) {
    if (file.includes('hosts') || file.includes('hst')) {
      const fileEle = document.createElement('div');
      fileEle.innerHTML = file;
      fileEle.classList.add('file');
      fileEle.id = file;
      filesEle.appendChild(fileEle);

      fileEle.addEventListener('click', () => {
        removeSelectedClass();
        fileEle.classList.add('selected');

        const command = ['cp', `${HOME}/hostly/${file}`, '/etc/hosts'];
        console.log(`executing command`, JSON.stringify(command));
        sudo.exec(command, function(err, pid, result) {
          if (err) {
            alert('変更に失敗しました。');
            removeSelectedClass();
            document.getElementById(lastHostFile).classList.add('selected');
          }

          lastHostFile = file;
          console.log(`${file} を設定しました。`);
        });
      })
    }
  }
});