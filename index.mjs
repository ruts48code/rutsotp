const getTimex = async (timenow) => {
  return new Promise(async (resolve) => {
    var [date, month, year] = [
      timenow.getDate(),
      timenow.getMonth() + 1,
      timenow.getFullYear(),
    ];
    var [hour, minute, second] = [
      timenow.getHours(),
      timenow.getMinutes(),
      timenow.getSeconds(),
    ];
    if (month < 10) {
      month = "0" + month;
    }
    if (date < 10) {
      date = "0" + date;
    }
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    if (second < 10) {
      second = "0" + second;
    }
    resolve(
      year +
        "-" +
        month +
        "-" +
        date +
        "T" +
        hour +
        ":" +
        minute +
        ":" +
        second,
    );
  });
};

const Delay = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const BufferToHex = async (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const hmacKey = async (key) => {
  const enc = new TextEncoder();
  const keyEnc = enc.encode(key);

  return await crypto.subtle.importKey(
    "raw",
    keyEnc,
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  );
};

const OTP = async (secret) => {
  return await OTPx(secret, new Date());
};

const OTPx = async (secret, timenow) => {
  return new Promise(async (resolve) => {
    const secretKey = await hmacKey(secret);
    const dataEnc = new TextEncoder().encode(await getTimex(timenow));
    let output = await crypto.subtle.sign("HMAC", secretKey, dataEnc);
    let outputHex = BufferToHex(output);
    resolve(outputHex);
  });
};

const CheckOTP = async (otp, secret) => {
  return await CheckOTPx(otp, secret, 5);
};

const CheckOTPx = async (otp, secret, time1) => {
  return new Promise(async (resolve) => {
    const timenow = new Date();
    for (let i = 0; i <= time1; i++) {
      let otpx = await OTPx(secret, new Date(timenow.getTime() - i * 1000));
      if (otpx == otp) {
        resolve(true);
      }
    }
    for (let i = 1; i <= time1; i++) {
      let otpx = await OTPx(secret, new Date(timenow.getTime() + i * 1000));
      if (otpx == otp) {
        resolve(true);
      }
    }
    resolve(false);
  });
};

export {
  getTimex,
  hmacKey,
  BufferToHex,
  Delay,
  OTP,
  OTPx,
  CheckOTP,
  CheckOTPx,
};
