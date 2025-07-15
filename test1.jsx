const sendOtp = async () => {
  if (!validateForm()) {
    return;
  }
  setIsSendingOtp(true);
 
  // setResendTimer(30);
  
  // const timerInterval = setInterval(() => {
  //   setResendTimer((prev) => {
  //     if (prev <= 1) {
  //       clearInterval(timerInterval);
  //       return 0;
  //     }
  //     return prev - 1;
  //   });
  // }, 1000);

  if (!formData.order_customer_mobile) {
    showNotification('Mobile number is required', 'error');
    setIsSendingOtp(false);
    return;
  }

  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(formData.order_customer_mobile)) {
    showNotification('Please enter a valid 10-digit Indian mobile number', 'error');
    setIsSendingOtp(false);
    return;
  }

  try {
    // Get reCAPTCHA Enterprise token
    // const token = await setupRecaptcha();
    // if (!token) {
    //   showNotification('Security verification failed', 'error');
    //   setIsSendingOtp(false);
    //   return;
    // }

    // Initialize Firebase Auth with the reCAPTCHA token
    const phoneNumber = `+91${formData.order_customer_mobile}`;
    
    // Create a temporary recaptcha container for Firebase
    const tempContainer = document.createElement('div');
    tempContainer.id = 'temp-recaptcha-container';
    tempContainer.style.display = 'none';
    document.body.appendChild(tempContainer);

    const appVerifier = new RecaptchaVerifier(auth, 'temp-recaptcha-container', {
      size: 'invisible',
      'expired-callback': () => {
        showNotification('Security verification expired. Please try again.', 'error');
      }
    });

    // Set the reCAPTCHA token manually
    (appVerifier as any).verify().then(() => {

      (appVerifier as any).recaptchaWidgetId = token;
    });

    const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    
    // Clean up
    document.body.removeChild(tempContainer);
    
    setConfirmationResult(result);
    setOtpSent(true);
    showNotification('OTP sent to your mobile number', 'success');
    setResendTimer(30);
  
  const timerInterval = setInterval(() => {
    setResendTimer((prev) => {
      if (prev <= 1) {
        clearInterval(timerInterval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  } catch (error: any) {
    console.error('Error in OTP process:', error);
    
    // Clean up in case of error
    const tempContainer = document.getElementById('temp-recaptcha-container');
    if (tempContainer) {
      document.body.removeChild(tempContainer);
    }
    
    let errorMessage = 'Failed to send OTP. Please try again.';
    
    if (error.code == 'auth/invalid-phone-number') {
      errorMessage = 'Invalid phone number format';
    } else if (error.code == 'auth/missing-phone-number') {
      errorMessage = 'Phone number is required';
    } else if (error.code == 'auth/quota-exceeded') {
      errorMessage = 'SMS quota exceeded. Please try again later.';
    }else if (error.code == 'auth/captcha-check-failed') {
      errorMessage = 'Recaptcha verification failed.';
    }
     else if (error.message.includes('reCAPTCHA')) {
      errorMessage = 'Security verification failed. Please try again.';
    } else if (error.code == 'auth/argument-error') {
      errorMessage = 'Security verification failed. Please refresh the page and try again.';
    }
    
    showNotification(errorMessage, 'error');
    await sendWhatsAppNotification(formData.order_customer_mobile);

  } finally {
    setIsSendingOtp(false);
  }
};




// Inside sendOtp function, replace the timer code with:
