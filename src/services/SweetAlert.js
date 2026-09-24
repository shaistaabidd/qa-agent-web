import Swal from 'sweetalert2'

export const SweetAlert = (message, icon = 'success') => {
  return Swal.fire({
    text: message,
    icon,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  })
}
