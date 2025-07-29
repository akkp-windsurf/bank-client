/**
 *
 * ForgotPasswordRedirect
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';
import { routes } from 'utils';
import messages from './messages';
import { StyledButton } from './styles';

function ForgotPasswordRedirect() {
  const dispatch = useDispatch();

  const onRedirect = () => dispatch(push(routes.forgetPassword.path));

  return (
    <StyledButton type="link" onClick={onRedirect}>
      <FormattedMessage {...messages.forgetPasswordAsk} />
    </StyledButton>
  );
}

ForgotPasswordRedirect.propTypes = {};

export default ForgotPasswordRedirect;
