import './App.css'
import { AppCotainer } from './container'
import { UsersProvider } from './impl/users'
import { createModule } from 'tiny-invert';


const AppProvider = AppCotainer.provider(
  (ctx) => function App() {
    const { UsersList, CreateUser } = ctx.innerDeps.Users;

    return (
      <>
        <h1>ts di example</h1>
        <div className="card">
          <div style={{ padding: '10px' }}>
            <CreateUser />
            <UsersList />
          </div>
        </div>
      </>
    )
  }, {
  Users: UsersProvider,
}
)

export const App = createModule(AppProvider).init()
