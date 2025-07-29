/**
 *
 * ForgotPasswordForm
 *
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { StyledForm, StyledFormWrapper } from 'components/Form/styles';
import ForgotPasswordAction from 'components/ForgotPasswordAction';
import { forgotPasswordAction } from 'containers/ForgetPasswordPage/actions';
import { makeSelectIsSuccess } from 'containers/ForgetPasswordPage/selectors';
import EmailAddress from '../ForgotPasswordContent/EmailAddress';
import messages from './messages';
import { StyledResult } from './styles';

function ForgotPasswordForm() {
  const [form] = StyledForm.useForm();
  const dispatch = useDispatch();
  const isSuccess = useSelector(makeSelectIsSuccess());

  const onForgot = () => dispatch(forgotPasswordAction());

  const onValidateFields = async () => {
    try {
      await form.validateFields();

      onForgot();
    } catch (error) {
      Error(error);
    }
  };

  return (
    <StyledFormWrapper>
      {isSuccess ? (
        <StyledResult
          status="success"
          title={<FormattedMessage {...messages.title} />}
          subTitle={<FormattedMessage {...messages.description} />}
        />
      ) : (
        <StyledForm
          name="forget-password"
          layout="vertical"
          centered="true"
          form={form}
        >
          <EmailAddress onValidateFields={onValidateFields} />

          <ForgotPasswordAction onValidateFields={onValidateFields} />
        </StyledForm>
      )}
    </StyledFormWrapper>
  );
}

ForgotPasswordForm.propTypes = {};

export default ForgotPasswordForm;
