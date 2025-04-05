export const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const formatStrDate = (rawDate) => {
  const date = new Date(rawDate).toLocaleString();
  const formatDate = date.replace(',', ' at')
  return formatDate
};

export const cookieExpireTime = () => {
  let now = new Date();
  let timeToExpire = now.getTime() + (60 * 60 * 1000); // Cookie expires in 1 hour
  now.setTime(timeToExpire);
  return now.toUTCString()
};

export const setDivToViewportSize = (divElement) => {
  if (!divElement) {
    console.error("Div element is null or undefined.");
    return;
  }

  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  divElement.style.width = `${viewportWidth}px`;
  divElement.style.height = `${viewportHeight}px`;
  console.log('resized')
}
