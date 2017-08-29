import React, { PropTypes } from 'react';
import { Table, Button } from 'semantic-ui-react';

const phoneMask = phone => `+7 ${phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "($1) $2-$3-$4")}`;

const UsersTable = (props) => {
  return (
    <Table striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Ф.И.О.</Table.HeaderCell>
          <Table.HeaderCell>Дата рождения</Table.HeaderCell>
          <Table.HeaderCell>Адрес</Table.HeaderCell>
          <Table.HeaderCell>Город</Table.HeaderCell>
          <Table.HeaderCell>Телефон</Table.HeaderCell>
          <Table.HeaderCell>Действие</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {
          props.data.map((item, key) => (
            <Table.Row key={key}>
              <Table.Cell>{item.fio}</Table.Cell>
              <Table.Cell>{`${item.day} ${props.months.filter((_, i) => i+1 == item.month)[0]} ${item.year}`}</Table.Cell>
              <Table.Cell>{item.address}</Table.Cell>
              <Table.Cell>{item.city}</Table.Cell>
              <Table.Cell>{phoneMask(item.phone)}</Table.Cell>
              <Table.Cell>
                <Button onClick={props.editUser.bind(this, key)} basic color='blue'>Изменить</Button>
                <Button onClick={props.removeUser.bind(this, key)} basic color='red'>Удалить</Button>
              </Table.Cell>
            </Table.Row>
          ))
        }
      </Table.Body>
    </Table>
  )
}

export default UsersTable;
