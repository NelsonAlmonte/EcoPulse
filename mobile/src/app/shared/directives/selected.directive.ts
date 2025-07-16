import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appSelected]',
})
export class SelectedDirective implements OnInit {
  private el = inject(ElementRef);
  defaultClass = input.required();

  ngOnInit(): void {
    this.el.nativeElement.classList.add(this.defaultClass());
  }

  @HostListener('click') onClick() {
    this.select();
  }

  private select() {
    if (this.el.nativeElement.classList.contains('selected')) {
      this.el.nativeElement.classList.remove('selected');
      this.el.nativeElement.classList.remove('bg-primary');
      this.el.nativeElement.classList.add(this.defaultClass());
    } else {
      this.el.nativeElement.classList.remove(this.defaultClass());
      this.el.nativeElement.classList.add('selected');
      this.el.nativeElement.classList.add('bg-primary');
    }
  }
}
