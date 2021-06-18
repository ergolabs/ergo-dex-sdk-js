import test from "ava"
import {RustModule} from "../../utils/rustLoader"
import {ergoTreeFromAddress} from "./ergoTree"

test.before(async () => {
  await RustModule.load(true)
})

test("ergoTreeFromAddress (P2PK)", async t => {
  t.is(
    ergoTreeFromAddress("9gPGo71icAXpgd44A688VqwC9ePKHAtMG1gvaZKV8daJy2AkEVC"),
    "0008cd02f5b53e746b83c3a12b0ee1ecfd14be592347a9a1834caa04f8341e5559d2ffce"
  )
})

test("ergoTreeFromAddress (P2S)", async t => {
  t.is(
    ergoTreeFromAddress(
      "Lr2R8cLAC2Hkk3Jvn9pjzLPmKpX7nY6S5G9VLsBwjfWBRDXW2KHc5tqwRNLCrJGEvt5Sc6pgzwysQDexRhSso3Az4ECRxzoeRMcPazRCZD6H6HcP1h8mPxvsfqbdqCK76fKtd4tvsUBAL8FzHtNDYi1wA9chj2UyQYEfuDCXzwfdzFsoCBz6UfhyNGnGNC9JJiF9SZd189MfYZBCrVjVeiSKotytkxcZS4xDTCEHcnD1JKDuXQguiW458b7RA8S9DLwwRCL4WvnvRDSFiJqdXAHfamJQ4FuEoGWVwtPn2p88Ki2FPmrT47Z8bYADtXD2pq2x7P2BBYbxMjuM7PspF1Wsj3NnNpcKFPW4pXfEYszLZm2kbSHF3dtkviRRSUTQZeDYcjtimwsoUTiQV1u4Ef5gUvaL2DPxhFtNcpdexebS8ndQMDSJFcKgfbRHKenptJ3vQYWdrU7DXVpG2r8Q7tNho3KaNu7UaUPrrxg8UgdpQ7XHVs2dCPFcsCL3ptJwFTHYUkjsUxdEXmz9EnS7HWkSeYqKoCpGFijA64dXMcj"
    ),
    "198f030f08cd02217daf90deb73bdf8b6709bb42093fdfaff6573fd47b630e2d3fdd4a8193a74d040004040e20020202020202020202020202020202020202020202020202020202020202020204060400050204d00f05cc0f0e200101010101010101010101010101010101010101010101010101010101010101040005b20105c601060203e6060203e6d810d6017300d602b2a4730100d603db63087202d604b27203730200d6058c720401d6067303d607b27203730400d6088c720701d609b2db6308a7730500d60a8c720901d60b7e8c72040206d60c998c7209027306d60d7e720c06d60e7e8c72070206d60f7307d6107e9c720c730806eb027201d1ededed93cbc272027309ec93720572069372087206ec937205720a937208720aaea5d9011163d802d613b2db63087211730a00d6148c721302edededed93c27211d07201938c7213017206927214730b92c1721199c1a79c7214730c959372057206909c9c720b720d730d9c7e7214069a9c720e7e720f067210909c9c720e720d730e9c7e7214069a9c720b7e720f067210"
  )
})

test("ergoTreeFromAddress (P2S without ProveDLog)", async t => {
  t.is(
    ergoTreeFromAddress(
      "2Ri1TEhSQXWcFcD2jfA6BL2hpToV5n5wEoPM8DaHHw4j8iHQUAqxB8WKD1XHVQbMPC62Nshpe6C2QaEVWTXmR2WkBRraWTecJLKeujrCgFEuJdriYZNd1hvL6ismzpcNGzW1UUZMMsstAWaxjXTX3RarkHVVsBuZscYTsYSUZkcTPSrBXkyhxg6AeBUJW6Z1pai5scNatRMRypM1b2DeTfbeKW4U3D73fHmxtkkBy2Pippp4x1QLrMY2p25Q2jRZxMf3N5EAfoLfWcdBnhgPdge19VKtyxQr6Fpw9bYpzHeoq4NjUtiHpbTFYs7MMcoShCc3Z8vyhEGnwvHD2fZjGMxUQWFsPbnXFicvNLsSdLQbQDvvoawUFfbYs4E9FXXKJ8m8ftTtcWnMpeMLW4FQSmYXUA6ZtU9PvtbqiAUv4P8PbCxjUH6XhHuhzaAYwcz56zfUUs71zqW7oTXY9qUEwvKrahFzXhtH7A2Xsx"
    ),
    "19dc020e040004040e20020202020202020202020202020202020202020202020202020202020202020204060400050204d00f05cc0f0e200101010101010101010101010101010101010101010101010101010101010101040005b20105c601060203e6060203e6d80fd601b2a4730000d602db63087201d603b27202730100d6048c720301d6057302d606b27202730300d6078c720601d608b2db6308a7730400d6098c720801d60a7e8c72030206d60b998c7208027305d60c7e720b06d60d7e8c72060206d60e7306d60f7e9c720b730706d1ededed93cbc272017308ec93720472059372077205ec93720472099372077209aea5d9011063d802d612b2db63087210730900d6138c721202ededed938c7212017205927213730a92c1721099c1a79c7213730b959372047205909c9c720a720c730c9c7e7213069a9c720d7e720e06720f909c9c720d720c730d9c7e7213069a9c720a7e720e06720f"
  )
})
