import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, of, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  editProfileForm!: FormGroup;
  user: User | undefined;
  selectedIcon: string | undefined; // Para armazenar o ícone selecionado pelo usuário

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.editProfileForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z0-9]*$'),
      ]),
    });

    this.userService.getCurrentUser().subscribe((user) => {
      this.user = user;
    });
  }

  onIconSelected(icon: string) {
    this.selectedIcon = icon;
  }
  isIconSelected(icon: string) {
    return this.selectedIcon === icon;
  }

  onIconSubmit() {
    if (!this.selectedIcon) {
      alert('Por favor, selecione um ícone.');
      return;
    }
    console.log(this.selectedIcon);
    this.userService
      .updateProfileIcon(this.selectedIcon)
      .subscribe((response: any) => {
        if (response.success) {
          alert('Ícone do perfil atualizado com sucesso!');
          if (this.user && this.selectedIcon) {
            this.user.profilePicture = this.selectedIcon;
          }
        } else {
          alert(
            'Ocorreu um erro ao atualizar o ícone do perfil. Por favor, tente novamente.'
          );
        }
      });
  }

  get usernameControl() {
    return this.editProfileForm.get('username');
  }

  onSubmit() {
    if (this.usernameControl && this.usernameControl.value === '') {
      alert('Por favor, insira um novo nome de usuário para atualizar.');
      return;
    }

    let updatedUsername: string | null = null;

    if (this.usernameControl && this.usernameControl.value !== '') {
      if (this.usernameControl.valid) {
        updatedUsername = this.usernameControl.value;
      } else {
        alert('Por favor, insira um nome de usuário válido.');
        return;
      }
    }

    const updateProfile = () => {
      this.userService
        .updateProfile(updatedUsername)
        .subscribe((response: any) => {
          if (response.success) {
            alert('Perfil atualizado com sucesso!');

            if (updatedUsername) {
              this.userService.updateCurrentUsername(updatedUsername);

              if (this.user) {
                this.user.name = updatedUsername;
              }
            }
          } else {
            alert(
              'Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente.'
            );
          }
        });
    };

    if (updatedUsername) {
      this.userService
        .checkUsernameAvailability(updatedUsername)
        .subscribe((isAvailable: boolean) => {
          if (!isAvailable) {
            alert(
              'O nome de usuário já está em uso. Por favor, escolha outro nome de usuário.'
            );
            return;
          } else {
            updateProfile();
          }
        });
    } else {
      updateProfile();
    }
  }

  goToDashboard() {
    this.userService.routeHere('/dashboard');
  }

  goToUserProfile() {
    if (this.user) {
      this.userService.routeHere('/user/' + this.user.name);
    }
  }
}
