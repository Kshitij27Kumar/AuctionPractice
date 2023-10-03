'use client'

import Link from 'next/link'
import { Layout, Menu } from 'antd'

const { Sider, Content } = Layout

const RootLayout = ({ children }: { children: React.ReactNode }) => (
    <html lang="en">
        <body>
            <Layout hasSider={true}>
                <Sider
                    width={200}
                    style={{ height: '100vh', backgroundColor: 'white' }}
                >
                    <Menu
                        items={[
                            {
                                key: 'auctions',
                                label: <Link href={'/auctions'}>Auctions</Link>,
                            },
                            {
                                key: 'teams',
                                label: <Link href={'/teams'}>Teams</Link>,
                            },
                            {
                                key: 'seasons',
                                label: <Link href={'/seasons'}>Seasons</Link>,
                            },
                            {
                                key: 'players',
                                label: <Link href={'/players'}>Players</Link>,
                            },
                        ]}
                    />
                </Sider>
                <Content>{children}</Content>
            </Layout>
        </body>
    </html>
)

export default RootLayout
