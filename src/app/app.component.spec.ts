@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, AccountComponent, ProfileComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected property name and type
})
export class AppComponent {
  title = 'assignment';
}
