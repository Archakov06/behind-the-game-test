import React, { Component } from 'react';
import axios from 'axios';
import { Container, Modal, Button, Form, Dropdown } from 'semantic-ui-react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import InputMask from 'react-input-mask';
import store from 'store';

import UsersTable from '../components/UserTable';

import * as appActions from '../actions/appActions';

class App extends Component {

  constructor() {
    super();
    this.state = {
      visibleAddEditModal: false,
      addEditAction: '',
      curIndex: 0,
      userDetails: {
        fio: '',
        phone: '',
        address: '',
        city: '',
        day: 1,
        month: 1,
        year: 1990
      },
      fieldsWithErros: {
        fio: false,
        phone: false,
        address: false,
        city: false,
        day: false,
        month: false,
        year: false
      },
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    };
  }

  componentWillMount() {
    this.userStorage('get');
  }

  userStorage(action) {
    if (action == 'set') {
      const {users} = this.props;
      store.set('users', users);
    } else {
      const {setUsers} = this.props.appActions;
      setUsers(store.get('users'));
    }
  }

  /**
   * Показ/Скрытие окна модального окна
   * @param  boolean b - показать или скрыть окно
   */
  showAddEditModal(b) {
    this.setState({
      visibleAddEditModal: b
    });
  }

  /**
   * Показать модальное окно.
   * Перед отображением, очищаем поля.
   * @return {[type]} [description]
   */
  showAddBlock() {
    this.setState({
      addEditAction: 'add',
      userDetails: {
        fio: '',
        phone: '',
        address: '',
        city: '',
        day: 1,
        month: 1,
        year: 1990,
      },
      fieldsWithErros: {
        fio: false,
        phone: false,
        address: false,
        city: false,
        day: false,
        month: false,
        year: false
      }
    }, this.showAddEditModal.bind(this, true));
  }

  /**
   * Удалить пользователя
   * @param  number i - индекс пользователя в списке.
   */
  removeUser(i) {
    if (confirm('Вы действительно хотите удалить?')) {
      const {removeUser} = this.props.appActions;
      removeUser(i);
    }
  }

  /**
   * Сохранить изменения или добавить пользователя.
   * Индекс берется из стейт свойства curIndex
   * @return {[type]} [description]
   */
  saveUser() {
    const {editUser, addUser} = this.props.appActions;

    if (this.validateFields()) return;

    if (this.state.addEditAction == 'add') {
      addUser(this.state.userDetails);
    } else {
      editUser(this.state.curIndex, this.state.userDetails);
    }

    setTimeout(() => {
      this.userStorage('set');
    });

    this.showAddEditModal(false);
  }

  /**
   * Внести данные пользователя в поля.
   * @param number i - индекс пользователя.
   */
  setUserDetails(i) {
    const {users} = this.props;
    this.setState({
      curIndex: i,
      addEditAction: 'edit',
      userDetails: users.filter((item, index) => index == i)[0],
    }, this.showAddEditModal.bind(this, true));
  }

  /**
   * Валидация полей.
   * @return [boolean] - возвращает boolean значение. Если true, форма не отправляется.
   */
  validateFields() {
    let error = false, erros = this.state.fieldsWithErros;
    for (let key in this.state.userDetails) {
      if (!this.state.userDetails[key]) {
        erros[key] = true;
        error = true;
      }
    }
    this.setState({
      fieldsWithErros: erros
    });
    return error;
  }

  /**
   * Вносит значения из полей в стейт.
   * @param [string] name - название поля (свойства).
   * @param [string] value - значение поля.
   */
  setFiled(name, value) {
    this.setState({
      userDetails: {
        ...this.state.userDetails,
        [name]: value
      },
    });
  }

  /**
   * Форматирует номер.
   * Пример: +7 (999) 111-22-33 -> 9991112233
   * @param  {[type]} s [description]
   * @return {[type]}   [description]
   */
  formatPhone(s) {
    return s.replace(/\D/g, '').substr(1);
  }

  render() {
    const {users} = this.props;

    return (
      <Container>

        <Modal size='tiny' open={this.state.visibleAddEditModal} onClose={this.showAddBlock.bind(this)}>
          <Modal.Header>{this.state.addEditAction == 'add' ? 'Добавление пользователя' : 'Редактирование пользователя'}</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Group widths='equal'>
                <Form.Input error={this.state.fieldsWithErros.fio} value={this.state.userDetails.fio} onChange={e => this.setFiled(e.target.id, e.target.value)} id='fio' label='Ф.И.О.' placeholder='Иванов Иван Иванович' />
                <Form.Input
                  label='Телефон'
                  id='phone'
                  error={this.state.fieldsWithErros.phone}
                  children={
                    <InputMask
                      mask="+7 (999) 999-99-99"
                      alwaysShowMask={true}
                      value={this.state.userDetails.phone}
                      onChange={e => this.setFiled('phone', this.formatPhone(e.target.value))}
                    />
                  }
                />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input error={this.state.fieldsWithErros.address} value={this.state.userDetails.address} onChange={e => this.setFiled(e.target.id, e.target.value)} id='address' label='Адрес' placeholder='Московская 12А' />
                <Form.Input error={this.state.fieldsWithErros.city} value={this.state.userDetails.city} onChange={e => this.setFiled(e.target.id, e.target.value)} id='city' label='Город' placeholder='Санкт-Петербург' />
              </Form.Group>
              <label>Дата рождения</label>
              <Form.Group widths='equal'>
                <Form.Field>
                  <Dropdown error={this.state.fieldsWithErros.day} value={this.state.userDetails.day} onChange={(_, data) => this.setFiled('day', data.value)} search selection placeholder='День' options={[...Array(31).keys()].map(n => ({text: n + 1, value: n + 1}))} />
                </Form.Field>
                <Form.Field>
                  <Dropdown error={this.state.fieldsWithErros.month} value={this.state.userDetails.month} onChange={(_, data) => this.setFiled('month', data.value)} search selection placeholder='Месяц' options={this.state.months.map((month, day) => ({text: month, value: day + 1}))} />
                </Form.Field>
                <Form.Field>
                  <Dropdown error={this.state.fieldsWithErros.year} value={this.state.userDetails.year} onChange={(_, data) => this.setFiled('year', data.value)} search selection placeholder='Год' options={Array.from(Array(28).keys()).map(i => ({text: i + 1990, value: i + 1990}))} />
                </Form.Field>
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.showAddEditModal.bind(this, false)}>Закрыть</Button>
            <Button onClick={this.saveUser.bind(this)} positive content={this.state.addEditAction == 'add' ? 'Добавить' : 'Сохранить'} />
          </Modal.Actions>
        </Modal>

        <Button onClick={this.showAddBlock.bind(this)} basic color='green'>Добавить пользователя</Button>

        <UsersTable
          editUser={this.setUserDetails.bind(this)}
          removeUser={this.removeUser.bind(this)}
          months={this.state.months}
          data={users}
        />

      </Container>
    );
  }
}

const mapStateToProps = ({usersStore}) => {
  return {
    users: usersStore.users
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
