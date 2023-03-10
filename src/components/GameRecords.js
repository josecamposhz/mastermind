import React from 'react';
import { Table, Icon, Header } from 'semantic-ui-react';
import Feedback from './feedback';
import '../assets/styles.css';

const GameRecords = ({ records }) => {
  const TableFirstRow = () => {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Answer</Table.HeaderCell>
          <Table.HeaderCell>Feedback</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };
  return (
    <div>
      <Table basic='very'>
        {records.length > 0 ? <TableFirstRow /> : ``}
        {records.map((record, index) => (
          <Table.Body key={`recor-table-${index}`}>
            <Table.Row>
              <Table.Cell>{record.value}</Table.Cell>
              <Table.Cell>
                <Feedback
                  exactMatches={record.exactMatches}
                  matchesByValue={record.matchesByValue}
                />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
      </Table>
    </div>
  );
};

export default GameRecords;
