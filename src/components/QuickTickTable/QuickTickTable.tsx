import { Table } from "@mantine/core";
import "./QuickTickTable.css";

export interface QuickTickTableRow {
    rowData: (string | JSX.Element)[];
}
interface QuickTickTableProps {
    headers: string[];
    rows: QuickTickTableRow[];
}
export default function QuickTickTable(props: QuickTickTableProps): JSX.Element {
    const buildHeaders = (): JSX.Element[] => {
        const headers: JSX.Element[] = [];

        {
            props.headers.forEach((header) => {
                headers.push(<th>{header}</th>);
            });
        }

        return headers;
    };

    const buildRows = (): JSX.Element[] => {
        const rows: JSX.Element[] = [];

        props.rows.forEach((row) => {
            rows.push(
                <tr>
                    {row.rowData.map((rowItem) => (
                        <td>{rowItem}</td>
                    ))}
                </tr>
            );
        });

        return rows;
    };

    return (
        <Table highlightOnHover={true} className="quick-tick-table">
            <thead>
                <tr>{buildHeaders()}</tr>
            </thead>
            <tbody>{buildRows()}</tbody>
        </Table>
    );
}