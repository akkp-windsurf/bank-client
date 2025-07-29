import React from 'react';
import { createStructuredSelector } from 'reselect';
import { makeSelectIsCollapsedSidebar } from 'containers/App/selectors';
import {
  collapsedSidebarAction,
  collapsedDrawerAction,
} from 'containers/App/actions';
import HeaderAction from 'components/App/HeaderAction';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import {
  StyledMenuUnfoldOutlined,
  StyledMenuFoldOutlined,
  StyledBarsOutlined,
  StyledHeader,
  StyledHeaderWrapper,
} from './styles';
import Mark from '../Mark';
import HeaderName from '../HeaderName';

interface HeaderState {
  isCollapsedSidebar: boolean;
}

const stateSelector = createStructuredSelector<any, HeaderState>({
  isCollapsedSidebar: makeSelectIsCollapsedSidebar(),
});

const Header: React.FC = () => {
  const { isCollapsedSidebar } = useAppSelector(stateSelector);
  const dispatch = useAppDispatch();
  
  const onCollapsedSidebar = (): void => {
    dispatch(collapsedSidebarAction());
  };
  
  const onCollapsedDrawer = (): void => {
    dispatch(collapsedDrawerAction());
  };

  return (
    <StyledHeader open={isCollapsedSidebar}>
      <StyledHeaderWrapper>
        {isCollapsedSidebar ? (
          <StyledMenuUnfoldOutlined onClick={onCollapsedSidebar} />
        ) : (
          <StyledMenuFoldOutlined onClick={onCollapsedSidebar} />
        )}

        <StyledBarsOutlined onClick={onCollapsedDrawer} />

        <HeaderName />
      </StyledHeaderWrapper>

      <HeaderAction />
      <Mark />
    </StyledHeader>
  );
};

export default Header;
