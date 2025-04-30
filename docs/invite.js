let current = 0;
let once = 0;
let inviteCount = 5;

const progressBar = document.querySelector('.progress-bar');
const inviteBtn = document.getElementById('inviteBtn');
const inviteCountSpan = document.getElementById('inviteCount');

function updateProgressBar(amount) {
  current = Math.min(current + amount, 100);
  progressBar.style.width = current + '%';
  progressBar.setAttribute('aria-valuenow', current);
}

function updateInviteCountDisplay() {
  inviteCountSpan.textContent = inviteCount;
  if (inviteCount <= 0) {
    inviteCountSpan.style.display = 'none';
  }
}

function requestEmailAndConfirm() {
  Swal.fire({
    title: 'Enter your email',
    input: 'email',
    inputLabel: 'We will send your UTME result to this email',
    inputPlaceholder: 'example@email.com',
    showCancelButton: true,
    confirmButtonText: 'Submit',
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      localStorage.setItem('userEmail', result.value);
      Swal.fire({
        icon: 'success',
        title: 'Email received!',
        text: 'We will send you your UTME result shortly.',
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'You did not enter an email.', 'info');
    }
  });
}

function handleInviteClick() {
  if (inviteCount <= 0 || inviteBtn.classList.contains('disabled')) return;

  // Special logic when inviteCount hits 3 the first time
  if (inviteCount === 3 && once !== 1) {
    once++;
    inviteCount++; // Prevent count from reducing yet
    setTimeout(() => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Try again"
      });
    }, 5000);
  }

  // Decrease invite count after delay
  inviteBtn.classList.add('disabled');

  setTimeout(() => {
    inviteCount--;
    updateInviteCountDisplay();

    if (inviteCount > 0) {
      inviteBtn.classList.remove('disabled');
    }

    updateProgressBar(20);

    if (inviteCount <= 0) {
      setTimeout(requestEmailAndConfirm, 5000);
    }
  }, 5000);
}

inviteBtn.addEventListener('click', handleInviteClick);
