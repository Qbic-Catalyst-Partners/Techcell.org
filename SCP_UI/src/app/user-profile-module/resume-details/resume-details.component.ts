import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactInfoComponent } from './modals/contact-info/contact-info.component';
import { AddEditEducationComponent } from './modals/add-edit-education/add-edit-education.component';
import { AddEditCertificationComponent } from './modals/add-edit-certification/add-edit-certification.component';
import { AddEditProjectComponent } from './modals/add-edit-project/add-edit-project.component';
import { AddEditAchievementComponent } from './modals/add-edit-achievement/add-edit-achievement.component';
import { AddEditExperinceComponent } from './modals/add-edit-experince/add-edit-experince.component';
import { FormBuilder } from '@angular/forms';
import { File_Size_1, File_Type_Accepted } from '../../common/constants';
import { fileSizeValidator, fileType } from '../../common/form-validations';
import { CommonService } from '../../common/common.service';
import { ResumeService } from './service/resume.service';
import { PdfViewerModalComponent } from '../../shared/component/pdf-viewer-modal/pdf-viewer-modal.component';
import { AuthUtils } from '../../shared/utility/auth-utils';

@Component({
  selector: 'app-resume-details',
  templateUrl: './resume-details.component.html',
  styleUrl: './resume-details.component.scss',
})
export class ResumeDetailsComponent implements OnInit {
  modalSetting: any = {
    keyboard: true,
    size: 'md',
    centered: true,
    backdrop: 'static',
  };
  contactInfo: any = [];
  addEducationList: any = [];
  addCertificationList: any = [];
  addProjectList: any = [];
  addAchievementList: any = [];
  addExperienceList: any = [];
  skillList: any = [];
  toolList: any = [];
  public imageType: string = File_Type_Accepted;
  public profilePhotoName: any;
  public profilePhoto: any;
  public isInfoEdit: boolean = false;
  public descriptionMaxChars: number = 500;
  profilePhotoTooltip: boolean = false;
  constructor(
    public modalService: NgbModal,
    private _fb: FormBuilder,
    public commonService: CommonService,
    private resumeService: ResumeService
  ) {}
  ngOnInit(): void {
    this.enableEdit('edit', false);
    this.prefillName();
  }

  private prefillName(): void {
    const userStr = AuthUtils.getUserDetails();
    if (!userStr) return;
    try {
      const userObj = JSON.parse(userStr);
      const detail = userObj?.userDetailResponseDTO || {};
      this.resumeForm.patchValue({
        firstName: detail.firstName || '',
        lastName: detail.lastName || '',
      });
      this.disableNameFields();
    } catch (e) {
      console.error('Unable to parse user details', e);
    }
  }

  private disableNameFields(): void {
    this.resumeForm.controls['firstName'].disable();
    this.resumeForm.controls['lastName'].disable();
  }

  public resumeForm: any = this._fb.group({
    firstName: [{ value: '', disabled: true }],
    lastName: [{ value: '', disabled: true }],
    objective: [''],
    Photo: [''],
  });

  openModal(modalType: string, data: any = null) {
    switch (modalType) {
      case 'contactInfo':
        this.contactInfoModal(data);
        break;
      case 'edcuation':
        this.educationModal(data);
        break;
      case 'certification':
        this.certificationModal(data);
        break;
      case 'project':
        this.projectModal(data);
        break;
      case 'achievement':
        this.achievementModal(data);
        break;
      case 'expernice':
        this.experniceModal(data);
        break;
    }
  }

  contactInfoModal(item: any) {
    const modalRef = this.modalService.open(
      ContactInfoComponent,
      this.modalSetting
    );
    modalRef.componentInstance.formValue = item;
    modalRef.result.then((response) => {
      if (response) {
        this.contactInfo = [];
        this.contactInfo.push({ ...response, id: this.contactInfo.length + 1 });
      }
    });
  }

  educationModal(item: any) {
    const modalRef = this.modalService.open(
      AddEditEducationComponent,
      this.modalSetting
    );
    modalRef.componentInstance.formValue = item;
    modalRef.result.then((response) => {
      if (response) {
        if (response?.id) {
          this.addEducationList = this.addEducationList.filter(
            (val: any) => val.id != response?.id
          );
          this.addEducationList.push(response);
          this.addEducationList.sort((a: any, b: any) => a.id - b.id);
        } else {
          this.addEducationList.push({
            ...response,
            id: this.addEducationList.length + 1,
          });
        }
        console.log(this.addEducationList);
      }
    });
  }

  certificationModal(item: any) {
    this.modalSetting = { ...this.modalSetting, size: 'lg' };
    const modalRef = this.modalService.open(
      AddEditCertificationComponent,
      this.modalSetting
    );
    modalRef.componentInstance.formValue = item;
    modalRef.result.then((response) => {
      if (response) {
        if (response?.id) {
          this.addCertificationList = this.addCertificationList.filter(
            (val: any) => val.id != response?.id
          );
          this.addCertificationList.push(response);
          this.addCertificationList.sort((a: any, b: any) => a.id - b.id);
        } else {
          this.addCertificationList.push({
            ...response,
            id: this.addCertificationList.length + 1,
          });
        }
        console.log(this.addCertificationList);
      }
    });
  }

  projectModal(item: any) {
    this.modalSetting = { ...this.modalSetting, size: 'lg' };
    const modalRef = this.modalService.open(
      AddEditProjectComponent,
      this.modalSetting
    );
    modalRef.componentInstance.formValue = item;
    modalRef.result.then((response) => {
      if (response) {
        if (response?.id) {
          this.addProjectList = this.addProjectList.filter(
            (val: any) => val.id != response?.id
          );
          this.addProjectList.push(response);
          this.addProjectList.sort((a: any, b: any) => a.id - b.id);
        } else {
          this.addProjectList.push({
            ...response,
            id: this.addProjectList.length + 1,
          });
        }
        console.log(this.addProjectList);
      }
    });
  }

  achievementModal(item: any) {
    this.modalSetting = { ...this.modalSetting, size: 'lg' };
    const modalRef = this.modalService.open(
      AddEditAchievementComponent,
      this.modalSetting
    );
    modalRef.componentInstance.formValue = item;
    modalRef.result.then((response) => {
      if (response) {
        if (response?.id) {
          this.addAchievementList = this.addAchievementList.filter(
            (val: any) => val.id != response?.id
          );
          this.addAchievementList.push(response);
          this.addAchievementList.sort((a: any, b: any) => a.id - b.id);
        } else {
          this.addAchievementList.push({
            ...response,
            id: this.addAchievementList.length + 1,
          });
        }
        console.log(this.addAchievementList);
      }
    });
  }

  experniceModal(item: any) {
    this.modalSetting = { ...this.modalSetting, size: 'lg' };
    const modalRef = this.modalService.open(
      AddEditExperinceComponent,
      this.modalSetting
    );
    modalRef.componentInstance.formValue = item;
    modalRef.result.then((response) => {
      if (response) {
        if (response?.id) {
          this.addExperienceList = this.addExperienceList.filter(
            (val: any) => val.id != response?.id
          );
          this.addExperienceList.push(response);
          this.addExperienceList.sort((a: any, b: any) => a.id - b.id);
        } else {
          this.addExperienceList.push({
            ...response,
            id: this.addExperienceList.length + 1,
          });
        }
        console.log(this.addExperienceList);
      }
    });
  }

  deleteResumeList(type: string, item: any) {
    switch (type) {
      case 'edcuation':
        this.addEducationList = this.addEducationList.filter(
          (val: any) => val.id != item?.id
        );
        break;
      case 'certification':
        this.addCertificationList = this.addCertificationList.filter(
          (val: any) => val.id != item?.id
        );
        break;
      case 'project':
        this.addProjectList = this.addProjectList.filter(
          (val: any) => val.id != item?.id
        );
        break;
      case 'achievement':
        this.addAchievementList = this.addAchievementList.filter(
          (val: any) => val.id != item?.id
        );
        break;
      case 'expernice':
        this.addExperienceList = this.addExperienceList.filter(
          (val: any) => val.id != item?.id
        );
        break;
    }
  }

  skillAdded(item: any) {
    if (item.length) {
      this.skillList.push({ id: this.skillList.length + 1, text: item });
    }
  }

  skillRemoved(item: any) {
    this.skillList = this.skillList.filter((val: any) => val.id != item.id);
  }

  toolsAdded(item: any) {
    if (item.length) {
      this.toolList.push({ id: this.toolList.length + 1, text: item });
    }
  }

  toolRemoved(item: any) {
    this.toolList = this.toolList.filter((val: any) => val.id != item.id);
  }

  submitData() {
    let payload = {
      resumeData: {
        firstName: this.resumeForm.controls['firstName'].value,
        lastName: this.resumeForm.controls['lastName'].value,
        objective: this.resumeForm.controls['objective'].value,
        skills: this.skillList,
        Tools: this.toolList,
        'Contact Info': this.contactInfo,
        Edcuation: this.addEducationList,
        Certification: this.addCertificationList,
        Project: this.addProjectList,
        Achievements: this.addAchievementList,
        Experience: this.addExperienceList,
      },
      resumePhoto: this.profilePhoto,
    };
    this.resumeService.updateResume(payload).subscribe({
      next: (res) => {
        console.log(res);
        this.enableEdit('edit', false);
      },
    });
  }

  getResumeDetails() {
    this.resumeService.getResume().subscribe({
      next: (res) => {
        if (res && res?.data?.resumeData) {
          const resumeDeatils = JSON.parse(res?.data?.resumeData);
          console.log(resumeDeatils);
          if (resumeDeatils) {
            // Get names, preferring resume details but falling back to user profile
            let localFirst = '';
            let localLast = '';
            const userStrLocal = AuthUtils.getUserDetails();
            if (userStrLocal) {
              try {
                const localObj = JSON.parse(userStrLocal);
                localFirst = localObj?.userDetailResponseDTO?.firstName || '';
                localLast = localObj?.userDetailResponseDTO?.lastName || '';
              } catch {}
            }

            this.resumeForm.patchValue({
              firstName: resumeDeatils.firstName || localFirst,
              lastName: resumeDeatils.lastName || localLast,
              objective: resumeDeatils.objective,
            });
            this.skillList = resumeDeatils?.skills;
            this.toolList = resumeDeatils?.Tools;
            this.contactInfo = resumeDeatils['Contact Info'];
            this.addEducationList = resumeDeatils?.Edcuation;
            this.addCertificationList = resumeDeatils?.Certification;
            this.addProjectList = resumeDeatils?.Project;
            this.addAchievementList = resumeDeatils?.Achievements;
            this.addExperienceList = resumeDeatils?.Experience;
            // Store photo from backend so preview gets populated
            this.profilePhoto = res?.data?.resumePhoto || this.profilePhoto;
          }
        }
      },
    });
  }

  public async upload(file: any) {
    const selectedFile = (file && (file.target as HTMLInputElement)).files[0];
    this.resumeForm
      .get('Photo')
      ?.setValidators([
        fileType(selectedFile),
        fileSizeValidator(selectedFile, File_Size_1),
      ]);
    this.resumeForm.get('Photo')?.updateValueAndValidity();
    this.profilePhotoName = file.target.files[0].name;
    this.profilePhoto = await this.commonService.fileToByteArray(
      file.target.files[0]
    );
  }

  public enableEdit(type: any, isEnable: boolean) {
    switch (type) {
      case 'edit':
        isEnable ? this.resumeForm.enable() : this.resumeForm.disable();
        this.disableNameFields();
        this.isInfoEdit = isEnable;
        if (!isEnable) {
          this.getResumeDetails();
        }
        break;
    }
  }

  public viewResume() {
    const modalRef = this.modalService.open(PdfViewerModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      keyboard: true,
    });
    modalRef.componentInstance.userId = this.getCurrentUserId();
  }

  private getCurrentUserId(): number {
    const userStr = AuthUtils.getUserDetails();
    if (!userStr) return 0;
    try {
      const userObj = JSON.parse(userStr);
      return +userObj.userDetailResponseDTO?.userId || 0;
    } catch {
      return 0;
    }
  }

  get fieldName() {
    return this.resumeForm.controls;
  }
}
