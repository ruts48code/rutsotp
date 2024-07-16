import {createHmac} from 'node:crypto';

export const getTimex = (timenow)=>{
	var [date, month, year] =[timenow.getDate(), timenow.getMonth()+1, timenow.getFullYear()];
	var [hour, minute, second] = [timenow.getHours(), timenow.getMinutes(), timenow.getSeconds()];
	if(month < 10){
		month = "0"+month;
	} 
	if(date < 10){
		date = "0"+date;
	}
	if(hour < 10) {
		hour = "0"+hour;
	}
	if(minute < 10){
		minute = "0"+minute;
	}
	if(second < 10){
		second = "0"+second;
	}
	return year+"-"+month+"-"+date+"T"+hour+":"+minute+":"+second;
}

export const OTP = (secret, size)=>{
	return OTPx(secret, size, new Date());
}

export const OTPx = (secret, size, timenow)=>{
	const hmac = createHmac('sha512', getTimex(timenow));
	return hmac.update(secret).digest('hex').slice(0, size*2);
}

export const CheckOTP = (otp, secret, size)=>{
	return CheckOTPx(otp, secret, size, 5);
}

export const CheckOTPx = (otp, secret, size, time1)=>{
	const timenow = new Date();
	for(let i = 0; i <= time1; i++){
		let otpx = OTPx(secret, size, new Date(timenow.getTime()-(i*1000)));
		if(otpx==otp) {
			return true;
		}
	}
	for(let i = 1; i <= time1; i++){
		let otpx = OTPx(secret, size, new Date(timenow.getTime()+(i*1000)));
		if(otpx==otp) {
			return true;
		}
	}
	return false;
}
