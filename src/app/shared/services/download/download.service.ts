import { Injectable } from "@angular/core";
// eslint-disable-next-line import/no-extraneous-dependencies
import jsPDF from "jspdf";
// eslint-disable-next-line import/no-extraneous-dependencies
import autoTable from "jspdf-autotable";

import { font } from "./font";

@Injectable({
    providedIn: "root"
})
export class DownloadService {
    async generatePdf(id: string) {
        // eslint-disable-next-line new-cap
        const doc = new jsPDF();
        doc.addFileToVFS("OpenSans-Regular.ttf", font);
        doc.addFont("OpenSans-Regular.ttf", "OpenSans-Regular", "normal",);
        doc.setFont("OpenSans-Regular");
        autoTable(doc, { html: `#${id}`, styles: { font: "OpenSans-Regular" }, useCss: true });
        doc.save(`${id}.pdf`);
    }
}
