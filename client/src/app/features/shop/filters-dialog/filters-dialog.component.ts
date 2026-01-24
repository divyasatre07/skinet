import { Component, inject, AfterViewInit, ViewChild } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { MatDivider } from '@angular/material/divider';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-filters-dialog',
  imports: [
    MatDivider,
    MatSelectionList,
    MatListOption,
    MatButton,
    FormsModule,MatIcon
  ],
  templateUrl: './filters-dialog.component.html',
  styleUrl: './filters-dialog.component.scss',
})
export class FiltersDialogComponent implements AfterViewInit {

  shopService = inject(ShopService);
  private dialogRef = inject(MatDialogRef<FiltersDialogComponent>);
  data = inject(MAT_DIALOG_DATA);

  selectedBrands: string[] = [...this.data.selectedBrands];
  selectedTypes: string[] = [...this.data.selectedTypes];

  @ViewChild('brandsList') brandsList!: MatSelectionList;
  @ViewChild('typesList') typesList!: MatSelectionList;

 ngAfterViewInit(): void {
  queueMicrotask(() => {
    this.restoreSelections();
  });
}

private restoreSelections() {
  this.brandsList.options.forEach(option => {
    option.selected = this.selectedBrands.includes(option.value);
  });

  this.typesList.options.forEach(option => {
    option.selected = this.selectedTypes.includes(option.value);
  });
}


  onBrandsChange(event: any) {
    this.selectedBrands = event.source.selectedOptions.selected
      .map((o: any) => o.value);
  }

  onTypesChange(event: any) {
    this.selectedTypes = event.source.selectedOptions.selected
      .map((o: any) => o.value);
  }

  applyFilters() {
    this.dialogRef.close({
      selectedBrands: this.selectedBrands,
      selectedTypes: this.selectedTypes
    });
  }
}
