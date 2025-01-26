import type { SelectProps } from 'antd'
import { Select, Spin } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import debounce from 'lodash/debounce'
import { useEffect, useMemo, useRef, useState } from 'react'

export interface DebounceSelectProps<T = object, ValueType = object>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  // fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
  route: string;
  query?: Record<string, unknown>;
  fetchOptionOnMount?: boolean;
  map?: (item: T) => DefaultOptionType;
  filter?: (item: T) => boolean;
  onSelect?: SelectProps<ValueType | ValueType[]>['onSelect'];
  className?: string;
}

export default function DebounceSelect<
  T extends object,
  ValueType extends object = DefaultOptionType
>({map, filter, ...props}: DebounceSelectProps<T, ValueType>) {
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState<ValueType[]>([])
  const fetchRef = useRef(0)

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1
      const fetchId = fetchRef.current
      setOptions([])
      setFetching(true)
      console.log({...props.query})
      fetch(`${props.route}?${new URLSearchParams({...props.query, search: value})}`)
        .then((response) => response.json())
        .then((data) => data.data)
        .then((newOptions) => {
          if (!newOptions.length) {
            console.log('Data tidak ditemukan')
            const emptyOptions: ValueType[] = [
              {
                label: 'Data tidak ditemukan',
                value: '',
                title: 'Data tidak ditemukan',
                disabled: true
              } as unknown as ValueType
            ]
            setOptions(emptyOptions)
            return
          }

          if (fetchId !== fetchRef.current) {
          // for fetch callback order
            return
          }

          if (filter) {
            newOptions = newOptions.filter(filter)
          }

          if (!newOptions.length) {
            const emptyOptions: ValueType[] = [
              {
                label: 'Data tidak ditemukan',
                value: '',
                title: 'Data tidak ditemukan',
                disabled: true
              } as unknown as ValueType
            ]
            setOptions(emptyOptions)
            return
          }

          if (map) {
            setOptions(newOptions.map(map))
          } else {
            setOptions(newOptions)
          }
          
          setFetching(false)
        })
    }

    return debounce(loadOptions, props.debounceTimeout || 800)
  }, [props.route, props.debounceTimeout, props.query, map])

  // Fetch options on first mount
  useEffect(() => {
    if (props.fetchOptionOnMount !== false) {
      debounceFetcher('')
    }
  }, [])

  return (
    <Select
      // labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      showSearch
      onFocus={() => debounceFetcher('')}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  )
}