import React from "react";
import {Table} from "@mantine/core";

export interface QuickTickTableRow {
    rowData: string[]
}
interface QuickTickTableProps {
    headers: string[],
    rows: QuickTickTableRow[]
}
export default function QuickTickTable(props: QuickTickTableProps) : JSX.Element {
    const buildHeaders = () : JSX.Element[] => {
        let headers: JSX.Element[] = [];

        {
            props.headers.forEach(header => {
                headers.push(<th>{header}</th>)
            })
        }

        return headers;
    }

    const buildRows = (): JSX.Element[] => {
        let rows : JSX.Element[] = [];

        props.rows.forEach(row => {
            rows.push(
                <tr>
                    {
                     row.rowData.map(rowItem =>
                        <td>
                            {rowItem}
                        </td>
                     )
                    }
                </tr>
            );
        });

        return rows;
    }

    return (
        <Table>
            <thead>
            <tr>
                {buildHeaders()}
            </tr>
            </thead>
            <tbody>
                {buildRows()}
            </tbody>
        </Table>
    );
}