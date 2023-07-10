import { Component, Input, OnInit } from "@angular/core";
import exportFromJSON from "export-from-json";

@Component({
  selector: "app-exporter",
  templateUrl: "./exporter.component.html",
  styleUrls: ["./exporter.component.css"],
})
export class ExporterComponent implements OnInit {
  public DEFAULT_EXPORT_TYPES = ["json", "csv", "xml", "xls"];

  /**
   * @description array of data to be exported
   */
  @Input() data!: any[] | null;
  /**
   * @description array of columns to be exported
   */
  @Input() columns!: string[];
  /**
   * @description array of exportFromJSON.types
   */
  @Input() types: string[] = this.DEFAULT_EXPORT_TYPES;

  public showExportType: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onExport() {
    this.toggleExportBtn();
  }

  export(type: string, all?: boolean) {
    let data: any;
    // manage custom field
    if (this.columns) {
      data = this.data?.map((element: any) => {
        let _object: any = {};
        for (const key of this.columns) {
          if (element?.hasOwnProperty(key)) {
            _object[key] = element[key];
          }
        }
        return _object;
      });
    } else {
      data = this.data;
    }
    const fileName = "salePoints";
    let exportType;
    switch (type) {
      case "csv":
        exportType = exportFromJSON.types.csv;
        exportFromJSON({ data, fileName, exportType });
        break;
      case "xls":
        exportType = exportFromJSON.types.xls;
        exportFromJSON({ data, fileName, exportType });
        break;
      case "xml":
        exportType = exportFromJSON.types.xml;
        exportFromJSON({ data, fileName, exportType });
        break;
      default:
        exportType = exportFromJSON.types.json;
        exportFromJSON({ data, fileName, exportType });
        break;
    }
    this.toggleExportBtn();
  }

  toggleExportBtn() {
    this.showExportType = !this.showExportType;
  }

  hasType(type: string) {
    return this.types.includes(type);
  }
}
