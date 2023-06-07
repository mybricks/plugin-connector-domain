import React, {FC, useCallback, useState} from 'react';
import FormItem from '../../../../components/FormItem';
import Switch from '../../../../components/Switch';
import Input from '../../../../components/Input';

interface RequestInfoProps {
	pageInfo?: {
		pageNumKey: string;
		pageSizeKey: string;
	};
	onChange(pageInfo?: Record<string, unknown>): void
}

const RequestInfo: FC<RequestInfoProps> = props => {
	const { pageInfo: defaultPageInfo, onChange } = props;
	const [showPager, setShowPager] = useState(!!defaultPageInfo);
	const [pageInfo, setPageInfo] = useState(defaultPageInfo || {
		pageNumKey: '',
		pageSizeKey: '',
	});
	
	const onChangeShowPager = useCallback(value => {
		onChange(value ? pageInfo : undefined);
		setShowPager(value);
	}, [pageInfo, onChange]);
	
  return (
		<>
			<FormItem label='开启分页'>
				<Switch defaultChecked={showPager} onChange={onChangeShowPager} />
			</FormItem>
			{showPager ? (
				<>
					<FormItem label='分页索引参数' labelStyle={{ lineHeight: '27px' }}>
						<Input
							defaultValue={pageInfo.pageNumKey}
							placeholder="请输入接口需要传递的分页索引参数命名，例如：pageNum"
							onBlur={(e) => {
								setPageInfo(info => {
									onChange({ ...info, pageNumKey: e.target.value });
									return { ...info, pageNumKey: e.target.value };
								});
							}}
						/>
					</FormItem>
					<FormItem label='分页大小参数' labelStyle={{ lineHeight: '27px' }}>
						<Input
							defaultValue={pageInfo.pageSizeKey}
							placeholder="请输入接口需要传递的分页大小参数命名，例如：pageSize"
							onBlur={(e) => {
								setPageInfo(info => {
									onChange({ ...info, pageSizeKey: e.target.value });
									return { ...info, pageSizeKey: e.target.value };
								});
							}}
						/>
					</FormItem>
				</>
			) : null}
		</>
  );
};

export default RequestInfo;
