// 结账页
import { useRef, useMemo, useEffect, useState } from 'react';
import { Money } from '@shopify/hydrogen';
import { Text } from '~/components';
import fetch from '~/fetch/axios';
import { getShopAddress, getLanguage, getDirection } from '~/lib/P_Variable';
const LText = getLanguage()
const addressList = LText.addressList

export default function settleAccounts() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }


  var canUseDOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.localStorage !== "undefined");
  let product = '';
  if (canUseDOM && window.localStorage.getItem('selectedVariant')) {
    product = JSON.parse(window.localStorage.getItem('selectedVariant'))
    product.product_id = new URLSearchParams(window.location.search).get('id');
    if (!product.availableForSale) {
      window.open(`/products/${product.product.handle}`, '_self')
    }
  } else {
    window.history.back()
  }

  return (
    <div className='settle_accounts'>
      <div className='settle_accounts_title shadow_box'>
        <div>
          <span onClick={() => { window.history.back() }} className='prev'><img src="https://platform.antdiy.vip/static/image/xiangzuo.svg" /></span>
          <span>{LText.confirRequest}</span>
          <i></i>
        </div>
      </div>
      <ProductBox product={product} />
      <Information product={product} />
      <PaymentMethod />
    </div>
  )
}

export function ProductBox({ product }) {
  return (
    <div className='product_box shadow_box' >
      {product.image ? <img src={product.image.url} /> : null}
      <div className='product_title'>
        <span>{product.product.title}</span>
        <span>{product.title}</span>
        <Text
          as="span"
          className="flex items-center gap-2"
        >
          {/* {
            product.compareAtPrice ? 
            <Money
              withoutTrailingZeros
              data={product.compareAtPrice}
              as="span"
              className="opacity-50 strike"
            /> : null
          } */}
          {/* <Money
            className='font_weight_b'
            withoutTrailingZeros
            data={product.price}
            as="span"
          /> */}
          <span className='font_weight_b'>{product.price.currencyCode}{parseFloat(product?.price?.amount)}</span>
        </Text>
      </div>
    </div >
  );
}


export function Information({ product }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [building, setBuilding] = useState('');
  const [street, setStreet] = useState('');
  const [streetList, setStreetList] = useState([{ name: 'Utca', value: '' }]);
  const [nearest, setNearest] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorText, setErrorText] = useState('');
  const [postcode, setPostcode] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  if (errorText) {
    timer(setErrorText)
  }
  let province = []
  if (LText.type === 'HUF' && addressList) {
    for (var i in addressList) {
      let obj = {
        name: i,
        value: i === 'Megye' ? '' : i,
        children: [{ name: 'Település/Kerület', value: '' }]
      }
      if (addressList[i]) {
        for (var j in addressList[i]) {
          obj.children.push({
            name: j,
            value: j,
          })
        }
      }
      province.push(obj)
    }
  }
  return (
    <div className='information_in'>
      <div className='information_in_title padding16'>{LText.recipientInfo}</div>
      <div className='information_in_list padding16'>
        <div className='in_list'>
          <div className='in_list_title'>
            <span>{LText.yourName} <i>*</i></span>
            <p></p>
          </div>
          <input type="text" placeholder={LText.fullName} value={name} onChange={(e) => { setName(e.target.value) }} />
        </div>
        <div className='in_list'>
          <div className='in_list_title'>
            <span>{LText.telephone} <i>*</i></span>
            <p></p>
          </div>
          {/* <div className='tele'>
            <span>+40</span> */}
          <input type="text" placeholder={LText.telephone} value={phone} onChange={(e) => { setPhone(e.target.value) }} />
          {/* </div> */}
        </div>
        {/* <div className='in_list'>
          <div className='in_list_title'>
            <span></span>
            <p></p>
          </div>
          <input type="text" placeholder={LText.phonepl2} value={whatsapp} onChange={(e) => { setWhatsapp(e.target.value) }} />
        </div> */}
        {
          LText.type === 'RO' ? <>
            <div className='in_list'>
              <div className='in_list_title'>
                <span>{LText.address} <i>*</i></span>
                <p></p>
              </div>
              <input type="text" placeholder={LText.address} value={area} onChange={(e) => { setArea(e.target.value) }} />
            </div>
            <div className='in_list'>
              <div className='in_list_title'>
                <span>{LText.governor} <i>*</i></span>
                <p></p>
              </div>
              <select name="state" nullmsg={LText.district} value={state} onChange={(e) => { setState(e.target.value); }} style={{ backgroundPosition: getDirection() === 'rtl' ? 'left .5rem center' : 'right .5rem center' }} >
                {
                  addressList.map((item, index) => {
                    return (
                      <option value={item.value} key={index}>{item.name}</option>
                    )
                  })
                }
              </select>
            </div>
            <div className='in_list'>
              <div className='in_list_title'>
                <span>{LText.city} <i>*</i></span>
                <p></p>
              </div>
              {
                LText.type === 'SA' ? <select name="city" nullmsg={LText.selectCity} value={city} onChange={(e) => { setCity(e.target.value) }} style={{ backgroundPosition: getDirection() === 'rtl' ? 'left .5rem center' : 'right .5rem center' }}>
                  {
                    addressList.filter(i => i.value === state)[0].children.map((item, index) => {
                      return (
                        <option value={item.value} key={index}>- - {item.value ? item.value + '/' : ''}{item.name}- -</option>
                      )
                    })
                  }
                </select> : <input type="text" placeholder={LText.city} value={city} onChange={(e) => { setCity(e.target.value) }} />
              }
            </div>
            <div className='in_list'>
              <div className='in_list_title'>
                <span>{LText.postalCode}</span>
                <p></p>
              </div>
              <input type="text" placeholder={LText.postalCode} value={postcode} onChange={(e) => { setPostcode(e.target.value) }} />
            </div>
          </> : <>
            {
              province && province.length > 0 ? <div className='in_list'>
                <div className='in_list_title'>
                  <span>Megye <i>*</i></span>
                  <p></p>
                </div>
                <select name="state" nullmsg={LText.district} value={state} onChange={(e) => { setState(e.target.value); setStreetList([{ name: 'Utca', value: '' }]); setCity(""); setPostcode(""); }} style={{ backgroundPosition: getDirection() === 'rtl' ? 'left .5rem center' : 'right .5rem center' }} >
                  {
                    province.map((item, index) => {
                      return (
                        <option value={item.value} key={index}>{item.name}</option>
                      )
                    })
                  }
                </select>
              </div> : null
            }
            <div className='in_list'>
              <div className='in_list_title'>
                <span>Település/Kerület <i>*</i></span>
                <p></p>
              </div>
              <select name="city" nullmsg={LText.selectCity} value={city} onChange={(e) => { changeCity(e.target.value, setStreetList, setPostcode, setArea); setCity(e.target.value) }} style={{ backgroundPosition: getDirection() === 'rtl' ? 'left .5rem center' : 'right .5rem center' }}>
                {
                  province.filter(i => i.value === state)[0].children.map((item, index) => {
                    return (
                      <option value={item.value} key={index}>{item.name}</option>
                    )
                  })
                }
              </select>
            </div>
            <div className='in_list'>
              <div className='in_list_title'>
                <span>{LText.address} <i>*</i></span>
                <p></p>
              </div>
              <select name="city" value={area} onChange={(e) => { changeArea(e.target.value, streetList, setPostcode); setArea(e.target.value) }} style={{ backgroundPosition: getDirection() === 'rtl' ? 'left .5rem center' : 'right .5rem center' }}>
                {
                  streetList.map((item, index) => {
                    return (
                      <option value={item.value} key={index}>{item.name}</option>
                    )
                  })
                }
              </select>
            </div>
            <div className='in_list'>
              <div className='in_list_title'>
                <span>{LText.postalCode}</span>
                <p></p>
              </div>
              <input disabled="disabled" type="text" placeholder={LText.postalCode} value={postcode} onChange={(e) => { setPostcode(e.target.value) }} />
            </div>
          </>
        }
        <div className='in_list'>
          <div className='in_list_title'>
            <span>{LText.semail}</span>
            <p></p>
          </div>
          <input name="email" type="text" placeholder={LText.semail} value={email} onChange={(e) => { setEmail(e.target.value) }} />
        </div>
        {/*
        <div className='in_list'>
          <div className='in_list_title'>
            <span>{LText.building} <i>*</i></span>
            <p></p>
          </div>
          <input type="text" placeholder={LText.buildingPle} value={building} onChange={(e) => { setBuilding(e.target.value) }} />
        </div>
        <div className='in_list'>
          <div className='in_list_title'>
            <span>{LText.street} <i>*</i></span>
            <p></p>
          </div>
          <input type="text" placeholder={LText.streetPle} value={street} onChange={(e) => { setStreet(e.target.value) }} />
        </div>
        <div className='in_list'>
          <div className='in_list_title'>
            <span>{LText.closest} <i>*</i></span>
            <p></p>
          </div>
          <input type="text" placeholder={LText.closestPle} value={nearest} onChange={(e) => { setNearest(e.target.value) }} />
        </div>
        <div className='in_list'>
          <div className='in_list_title'>
            <span>{LText.comments} <i>*</i></span>
            <p></p>
          </div>
          <textarea type="text" placeholder='' value={message} onChange={(e) => { setMessage(e.target.value) }} />
        </div> */}
      </div>
      <div className='settle_accounts_foot'>
        <div>
          <Text
            as="span"
            className="flex items-center gap-2"
            style={{ margin: '0 20px' }}
          >
            {/* <Money
              className='font_weight_b'
              withoutTrailingZeros
              data={product.price}
              as="span"
            /> */}
            <span className='font_weight_b'>{product.price.currencyCode}{parseFloat(product?.price?.amount)}</span>
          </Text>
          <div className='submit_btn'>
            {
              isSubmit ? <div className='loading_box'>
                <img src="https://platform.antdiy.vip/static/image/hydrogen_loading.gif" />
              </div> : null
            }
            <button className='inline-block rounded font-medium text-center w-full bg-primary text-contrast' onClick={() => {
              SettleAccounts(
                product,
                {
                  name: name,
                  email: email,
                  phone: phone,
                  // whatsapp: whatsapp,
                  country: LText.country,
                  country_code: LText.type,
                  state: state,
                  city: city,
                  area: area,
                  postcode: postcode,
                  // building: building,
                  // street: street,
                  // nearest_land_mark: nearest,
                  // message: message,
                },
                setErrorText,
                setIsSubmit
              )
            }}>
              <Text
                as="span"
                className="flex items-center justify-center gap-2 py-3 px-6 font_weight_b"
              >
                <span>{LText.apply}</span>
              </Text>
            </button>
          </div>
        </div>
      </div>
      {errorText ? <div className='error_box'>
        <span>{errorText}</span>
      </div> : null}
    </div>
  )
}

function changeArea(value, streetList, setPostcode) {
  let streetObj = streetList.filter(i => i.value === value)[0]
  setPostcode(streetObj ? streetObj.code : streetList[0].code)

}

function changeCity(value, setStreetList, setPostcode, setArea) {
  fetch.get(`https://gateway.antdiy.vip/account-service/media_orders/pass/street?value=${value}`).then(res => {
    if (res && res.data && res.data.success && res.data[value]) {
      let list = JSON.parse(res.data[value])
      let streetData = []
      for (var i in list) {
        streetData.push({
          name: i,
          value: i,
          code: list[i]
        })
      }
      if (streetData && streetData.length > 0) {
        setStreetList(streetData)
        setPostcode(streetData[0].code)
        setArea(streetData[0].value)
      }
    }
  })
}

function timer(setErrorText) {
  var count = 2;
  let countdown = setInterval(function () {
    count--;
    if (count < 1) {
      clearInterval(countdown);
      return setErrorText('')
    }
  }, 800)
}

export function PaymentMethod() {
  return (
    <div className='padding16'>
      <div className='payment_method'>
        <div className='information_in_title'>{LText.method}</div>
        <div>
          <div className="payment_method_check">
            <div>
              <input type="radio" name="payment" defaultChecked="true" />
              <p>{LText.recieving}</p>
            </div>
            <img src="https://platform.antdiy.vip/static/image/hydrogen_icon_delivery.svg" />
          </div>
          <div className='description'>{LText.onlinePayment}</div>
        </div>
      </div>
      <div className='order_tips'>
        <span>{LText.Website}</span>
        <p>{LText.homepage}</p>
      </div>
    </div>
  )
}

function SettleAccounts(product, params, setErrorText, setIsSubmit) {
  if (!params.name || !params.phone || !params.state || !params.city || !params.area) {
    return setErrorText(LText.empty)
  }
  // var emailRegExp = /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/;
  // if (!emailRegExp.test(params.email)) {
  //   return setErrorText(LText.correct)
  // }
  // var regex = new RegExp(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/);
  // console.log(regex.test('0501234567'))
  // params.phone = '+40' + params.phone
  // var pattern = /^\+\d{1,3}\d{1,14}$/;
  // if (!pattern.test(params.phone)) {
  //   return setErrorText(LText.validnum)
  // }
  // if(params.phone && !(regex.test(params.phone))){
  // if (params.phone.length < 4 || params.phone.length > 15) {
  //   return setErrorText(LText.validnum)
  // }
  let line_items = [{
    product_id: setSplit(product.product_id),
    quantity: 1,
    variant_id: setSplit(product.id),
  }]
  let source_name = window.localStorage.getItem('sourceName')
  params.line_items = line_items
  params.count = 1
  params.shop = getShopAddress()
  params.source = source_name ? source_name : null
  if (LText.type === 'HUF') {
    params.tags = LText.type
  }
  setIsSubmit(true)

  fetch.post(`https://gateway.antdiy.vip/account-service/media_orders/create/pass`, params).then(res => {
    if (res && res.data) {
      if (res.data.success && res.data.data && res.data.data.oid) {
        window.open(`/thank_you?id=${res.data.data.oid}`, '_self')
      } else {
        setIsSubmit(false)
        return setErrorText(res && res.data.msg || LText.orderError)
      }
    } else {
      setIsSubmit(false)
    }
  })
}

function setSplit(data) {
  if (data.indexOf('/') > -1) {
    let arr = data.split('/')
    return arr[arr.length - 1]
  } else {
    return data
  }
}