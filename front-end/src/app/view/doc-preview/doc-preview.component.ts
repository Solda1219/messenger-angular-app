import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-doc-preview',
  templateUrl: './doc-preview.component.html',
  styleUrls: ['./doc-preview.component.scss']
})
export class DocPreviewComponent implements OnInit {
  loading = true;
  viewer = 'url';//google (default), office, mammoth, pdf or url
  // selectedType = 'pptx'; //'docx';
  // doc = 'https://file-examples.com/wp-content/uploads/2017/02/file-sample_100kB.docx';
  // doc = 'https://files.fm/down.php?i=axwasezb&n=SSaD.docx';
  doc;

  // https://github.com/guigrpa/docx-templates#readme
  

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.userService.postRequest('_api/cloudDiskController/getOne',{id:id},false).subscribe(
      res=>{
        this.doc = '/'+res['result']['path'];
        const fileName = String(this.doc);
        const ext = fileName.substring(fileName.lastIndexOf('.'));
        this.viewer = ext=='.docx'||ext=='doc'?'mammoth':'url';
        this.loading = false;
      },
      err=>{
        this.userService.handleError(err)
        this.loading = false;
      }
    );
  }
}