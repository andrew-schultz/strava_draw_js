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
