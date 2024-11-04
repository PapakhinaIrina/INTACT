import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './index.css';

export const CreditForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [formatedNameValue, setFrormatedNameValue ] = useState('');

  const handleChange = (event) => {
    const inputValue = event.target.value;
    const digitsOnly = inputValue.replace(/[^0-9]/g, '');
    const formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}${digitsOnly.slice(4)}`;
    setFormattedValue(formatted);
  };

  const handleNameChange = (event) => {
    const getNameValue = event.target.value;
    const toCoverText = getNameValue.toUpperCase();
    setFrormatedNameValue(toCoverText);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('https://example.com/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: '316b2be8-3475-4462-bd57-c7794d4bdb53',
          secret: '1234567890',
          custom_data: `${data.initiatorName}.${data.collectionName}`,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке данных');
      }
      setSuccessMessage('Данные успешно отправлены!');
    } catch (error) {
      console.error('Произошла ошибка:', error);
      setErrorMessage('Произошла ошибка при отправке данных');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='wrapper'>
      <div className='container'>
        <div className='input_wrapper'>
        <label htmlFor="cardNumber">Номер карты:</label>
        <input
          {...register('cardNumber', {
            required: 'Пожалуйста, введите номер карты',
            pattern: {
              value: /^\d{16}$/,
              message: 'Номер карты должен состоять из 16 цифр',
            },
          })}
          mask="9999 9999 9999 9999"
          maxLength={16}
          type="text"
          id="cardNumber"
          placeholder="Номер карты"
          className='input'
        />
        </div>
        {errors.cardNumber && <div className='error_wrapper'><span>{errors.cardNumber.message}</span> </div>}

        <div className='input_wrapper'>
          <label htmlFor="expirationDate">Дата истечения:</label>
          <input
            {...register('expirationDate', {
              required: 'Пожалуйста, укажите дату истечения',
            })}
            type="text"
            id="expirationDate"
            maxLength={7}
            placeholder="MM/YYYY"
            className='input'
            onChange={handleChange}
            value={formattedValue}
          />
        </div>
  
        {errors.expirationDate && <div className='error_wrapper'><span>{errors.expirationDate.message}</span></div>}

      <div className='input_wrapper'>
        <label htmlFor="cvv">CVC:</label>
        <input
          {...register('cvv', {
            required: 'Пожалуйста, введите CVC',
            minLength: {
              value: 3,
              message: 'CVC должно содержать не менее 3 символов',
            },
          })}
          mask="999"
          type="password"
          maxLength={3}
          id="cvv"
          placeholder="CVC"
          className='input'
        />
      </div>
        {errors.cvv && <div className='error_wrapper'><span>{errors.cvv.message}</span> </div>}

      <div className='input_wrapper'>
        <label htmlFor="amount">Сумма перевода:</label>
        <input
          {...register('amount', {
            required: 'Пожалуйста, укажите сумму перевода',
            min: {
              value: 10,
              message: 'Сумма должна быть не менее 10 рублей',
            },
            pattern: {
              value: /^\d+$/,
              message: 'Введите целое положительное число',
            },
          })}
          type="number"
          id="amount"
          placeholder="Сумма перевода"
          className='input'
        />
      </div>
        {errors.amount &&  <div className='error_wrapper'><span>{errors.amount.message}</span> </div>}

      <div className='input_wrapper'>
        <label htmlFor="name">Имя:</label>
        <input
          {...register('name', {
            required: 'Пожалуйста, введите имя',
            maxLength: {
              value: 50,
              message: 'Максимальная длина имени - 50 символов',
            },
          })}
          type="text"
          id="name"
          placeholder="Ваше имя"
          className='input'
          onChange={ handleNameChange}
          value={formatedNameValue}
        />
      </div>
        {errors.name && <div className='error_wrapper'><span>{errors.name.message}</span></div>}

        <div className='button_wrapper'>
          <button type="submit" disabled={isSubmitting} className='button'>
            Отправить данные
          </button>
        </div>


      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </div>
    </form>
  );
};