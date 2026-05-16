import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const { pathname } = useLocation(); // ДОБАВИЛИ

  const isConstructorActive =
    pathname === '/' || pathname.startsWith('/ingredients');

  const isFeedActive = pathname.startsWith('/feed');

  const isProfileActive = pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={`${styles.link} ${
              isConstructorActive ? styles.link_active : ''
            } text text_type_main-default mr-10`}
          >
            <>
              <BurgerIcon
                type={isConstructorActive ? 'primary' : 'secondary'}
              />
              <p className='text text_type_main-default ml-2'>Конструктор</p>
            </>
          </NavLink>

          <NavLink
            to='/feed'
            className={`${styles.link} ${
              isFeedActive ? styles.link_active : ''
            } text text_type_main-default`}
          >
            <>
              <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </>
          </NavLink>
        </div>

        <NavLink to='/' className={styles.logo}>
          <Logo className='' />
        </NavLink>

        <NavLink
          to='/profile'
          className={`${styles.link} ${styles.link_position_last} ${
            isProfileActive ? styles.link_active : ''
          }`}
        >
          <>
            <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </>
        </NavLink>
      </nav>
    </header>
  );
};
