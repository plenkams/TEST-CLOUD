const publicId = 'pk_0a6d2638d233c9299c8fae7cd7e2e';

document.getElementById('donateForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const lastName = document.getElementById('lastName').value.trim();
  const firstName = document.getElementById('firstName').value.trim();
  const middleName = document.getElementById('middleName').value.trim();

  const fullName = `${lastName} ${firstName} ${middleName}`.trim();

  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const comment = document.getElementById('comment').value.trim();
  const amount = Number(document.getElementById('amount').value);
  const monthly = document.getElementById('monthly').checked;

  const words = fullName.split(/\s+/).filter(Boolean);

  if (words.length === 0 || words.length > 5) {
    alert('ФИО: максимум 5 слов');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    alert('Некорректный email');
    return;
  }

  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.length < 10) {
    alert('Некорректный телефон');
    return;
  }

  if (!amount || amount <= 0) {
    alert('Введите корректную сумму');
    return;
  }

  const widget = new cp.CloudPayments();

  const intentParams = {
    publicTerminalId: publicId,
    amount: amount,
    currency: 'RUB',
    description: 'Пожертвование',
    paymentSchema: 'Single',
    culture: 'ru-RU',

metadata: {
  comment: comment
},

userInfo: {
      accountId: email,
      firstName: firstName,
      lastName: lastName,
      middleName: middleName,
      fullName: fullName,
      phone: '+' + cleanPhone,
      email: email
    }
  };

  if (monthly) {
    intentParams.recurrent = {
      interval: 'Month',
      period: 1
    };
  }

  widget.start(intentParams)
    .then(function (result) {
      alert(monthly
        ? 'Оплата успешна. Подписка создана.'
        : 'Оплата успешна');

      console.log(result);
    })
    .catch(function (err) {
      console.error(err);
      alert('Ошибка оплаты');
    });

});