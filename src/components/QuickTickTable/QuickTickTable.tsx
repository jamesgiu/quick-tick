import { Table } from "@mantine/core";
import "./QuickTickTable.css";

export interface QuickTickTableRow {
    key: string;
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
            props.headers.forEach((header, index) => {
                headers.push(<th key={`${header}-${index}`}>{header}</th>);
            });
        }

        return headers;
    };

    const buildRows = (): JSX.Element[] => {
        const rows: JSX.Element[] = [];

        props.rows.forEach((row) => {
            rows.push(
                <tr key={row.key}>
                    {row.rowData.map((rowItem, index) => (
                        <td key={`${row.key}-${index}`}>{rowItem}</td>
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
