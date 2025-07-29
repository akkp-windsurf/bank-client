import React, { useEffect } from 'react';
import { createStructuredSelector } from 'reselect';
import { makeSelectCurrentStep } from 'containers/PaymentPage/selectors';
import { FormattedMessage } from 'react-intl';
import PaymentStep from 'components/App/PaymentStep';
import { StyledFormWrapper, StyledForm } from 'components/Form/styles';
import PaymentAction from 'components/App/PaymentAction';
import { checkRecipientAction } from 'containers/PaymentPage/actions';
import { nextStepAction } from 'containers/App/actions';
import { useAppSelector, useAppDispatch } from 'hooks';
import {
  Bill,
  Recipient,
  AmountMoney,
  TransferTitle,
  Confirm,
} from 'components/App/PaymentContent';
import messages from './messages';

interface PaymentFormState {
  currentStep: number;
}

interface PaymentStep {
  id: number;
  title: React.ReactNode;
  content: React.ReactNode;
}

const stateSelector = createStructuredSelector<any, PaymentFormState>({
  currentStep: makeSelectCurrentStep(),
});

const PaymentForm: React.FC = () => {
  const { currentStep } = useAppSelector(stateSelector);
  const dispatch = useAppDispatch();
  const [form] = StyledForm.useForm();

  const onNextStep = (): void => {
    dispatch(nextStepAction());
  };
  
  const onCheckRecipient = (): void => {
    dispatch(checkRecipientAction());
  };

  useEffect(() => {
    form.validateFields(['recipientBill']).catch(() => {
    });
  }, [form]);

  const onValidateFields = async (): Promise<void> => {
    try {
      await form.validateFields();

      if (currentStep === steps.length - 1) {
        onNextStep();
      } else if (currentStep === 1) {
        onCheckRecipient();
      } else {
        onNextStep();
      }
    } catch (err) {
      console.error('Form validation error:', err);
    }
  };

  const steps: PaymentStep[] = [
    {
      id: 1,
      title: <FormattedMessage {...messages.bill} />,
      content: <Bill />,
    },
    {
      id: 2,
      title: <FormattedMessage {...messages.recipient} />,
      content: <Recipient onValidateFields={onValidateFields} />,
    },
    {
      id: 3,
      title: <FormattedMessage {...messages.amountMoney} />,
      content: <AmountMoney onValidateFields={onValidateFields} />,
    },
    {
      id: 4,
      title: <FormattedMessage {...messages.transferTitle} />,
      content: <TransferTitle onValidateFields={onValidateFields} />,
    },
    {
      id: 5,
      title: <FormattedMessage {...messages.confirmData} />,
      content: <Confirm />,
    },
  ];

  return (
    <>
      <PaymentStep steps={steps} />

      <StyledFormWrapper shadowed="true">
        <StyledForm
          centered="true"
          form={form}
          layout="vertical"
          name="payment"
        >
          {steps[currentStep].content}
        </StyledForm>

        <PaymentAction steps={steps} onValidateFields={onValidateFields} />
      </StyledFormWrapper>
    </>
  );
};

export default PaymentForm;
