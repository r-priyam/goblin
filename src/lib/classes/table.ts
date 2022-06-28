export class TabularData {
	private _widths: number[] = [];
	private _columns: string[] = [];
	private _rows: string[][] = [];

	public setColumns(columns: string[]) {
		this._columns = columns;
		this._widths = columns.map((c) => c.length + 2);
	}

	public addRow(row: any[]) {
		const rows = row.map(String);
		this._rows.push(rows);

		for (const [index, entry] of rows.entries()) {
			const width = entry.length + 2;
			if (width > this._widths[index]) {
				this._widths[index] = width;
			}
		}
	}

	public addRows(rows: any[]) {
		for (const row of rows) {
			this.addRow(row);
		}
	}

	public clearRows() {
		this._rows = [];
	}

	public renderTable() {
		let separator = this._widths.map((w) => '-'.repeat(w)).join('+');
		separator = `+${separator}+`;

		const toDraw = [separator];
		toDraw.push(this.getEntry(this._columns), separator);

		for (const row of this._rows) {
			toDraw.push(this.getEntry(row));
		}

		toDraw.push(separator);
		return toDraw.join('\n');
	}

	private getEntry(data: string[]) {
		const element = data.map((element, index) => this.centerAlign(element, this._widths[index])).join('|');
		return `|${element}|`;
	}

	private centerAlign(value: string, width: number) {
		const padding = Math.floor((width - value.length) / 2);
		return `${' '.repeat(padding)}${value}${' '.repeat(padding)}`;
	}
}
