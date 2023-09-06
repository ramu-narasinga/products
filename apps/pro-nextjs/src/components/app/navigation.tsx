import React from 'react'
import Image from 'next/image'
import {trpc} from '@/trpc/trpc.client'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {twMerge} from 'tailwind-merge'
import {cn} from '@skillrecordings/ui/utils/cn'
import {DocumentIcon, LogoutIcon} from '@heroicons/react/outline'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@skillrecordings/ui'
import {signOut, useSession} from 'next-auth/react'
import Gravatar from 'react-gravatar'
import cx from 'classnames'

const useAbilities = () => {
  const {data: abilityRules} = trpc.abilities.getAbilities.useQuery()

  return createAppAbility(abilityRules || [])
}

const links = [
  {
    label: 'Articles',
    href: '/articles',
    icon: <DocumentIcon className="w-4 opacity-75" />,
  },
]

type NavigationProps = {
  className?: string
}

const Navigation: React.FC<NavigationProps> = ({className}) => {
  const ability = useAbilities()
  const canViewTeam = ability.can('view', 'Team')
  const canViewInvoice = ability.can('view', 'Invoice')
  const {pathname, asPath} = useRouter()
  const isRoot = pathname === '/'

  return (
    <nav
      aria-label="top"
      className={twMerge(
        'mx-auto flex w-full max-w-screen-md items-center justify-between p-5',
        className,
      )}
    >
      <Link
        href="/"
        aria-current={isRoot}
        tabIndex={isRoot ? -1 : 0}
        passHref
        className="flex items-center gap-1 text-lg font-semibold"
      >
        <Image
          src={require('../../../public/favicon.ico')}
          alt=""
          width={24}
          height={24}
        />{' '}
        Pro Next.js
      </Link>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1 text-sm">
          {links.map(({href, label, icon}) => {
            const isCurrent = asPath === href

            return (
              <Link
                href={href}
                className={cn(
                  'inline-flex items-center gap-1 opacity-75 transition hover:opacity-100',
                  {
                    underline: isCurrent,
                  },
                )}
                onClick={() => {
                  track(`clicked ${label} from navigation`)
                }}
                passHref
              >
                {icon} {label}
              </Link>
            )
          })}
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Login />
          <User />
        </div>
      </div>
    </nav>
  )
}

const User: React.FC<{className?: string}> = ({className}) => {
  const {pathname} = useRouter()
  const {data: sessionData, status: sessionStatus} = useSession()
  const isLoadingUserInfo = sessionStatus === 'loading'

  return (
    <>
      {isLoadingUserInfo || !sessionData?.user?.email ? null : (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn('mr-3 flex items-center space-x-1', className)}
          >
            <Gravatar
              className="h-4 w-4 rounded-full"
              email={sessionData?.user?.email}
              default="mp"
            />
            <div className="flex flex-col">
              <span className="text-sm">{sessionData?.user?.name}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut()
              }}
              className="flex items-center justify-between"
            >
              {' '}
              <span>Log out</span>
              <LogoutIcon className="h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}

const Login: React.FC<{className?: string}> = ({className}) => {
  const {pathname} = useRouter()
  const {data: sessionData, status: sessionStatus} = useSession()
  const isLoadingUserInfo = sessionStatus === 'loading'

  return (
    <>
      {isLoadingUserInfo || sessionData?.user?.email ? null : (
        <Link
          href="/login"
          className={cn(
            'hover:opacity-100flex group items-center gap-1 rounded-md px-2.5 py-1 transition',
            {
              'underline opacity-100': pathname === '/login',
              'opacity-75': pathname !== '/login',
            },
            className,
          )}
        >
          Log in
        </Link>
      )}
    </>
  )
}

export default Navigation
