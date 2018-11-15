export {Redirect}

function Redirect (url, timeout) {
  setTimeout(() => {
    window.location.href = url
  }, timeout)
}
