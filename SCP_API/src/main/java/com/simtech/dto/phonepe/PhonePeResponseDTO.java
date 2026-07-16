package com.simtech.dto.phonepe;

public class PhonePeResponseDTO {
	private boolean success;
	private String code;
	private String message;
	private DataDTO data;

	// Getters and Setters

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public DataDTO getData() {
		return data;
	}

	public void setData(DataDTO data) {
		this.data = data;
	}

	public static class DataDTO {
		private String merchantId;
		private String merchantTransactionId;
		private InstrumentResponseDTO instrumentResponse;

		// Getters and Setters

		public String getMerchantId() {
			return merchantId;
		}

		public void setMerchantId(String merchantId) {
			this.merchantId = merchantId;
		}

		public String getMerchantTransactionId() {
			return merchantTransactionId;
		}

		public void setMerchantTransactionId(String merchantTransactionId) {
			this.merchantTransactionId = merchantTransactionId;
		}

		public InstrumentResponseDTO getInstrumentResponse() {
			return instrumentResponse;
		}

		public void setInstrumentResponse(InstrumentResponseDTO instrumentResponse) {
			this.instrumentResponse = instrumentResponse;
		}

		public static class InstrumentResponseDTO {
			private String type;
			private RedirectInfoDTO redirectInfo;

			public String getType() {
				return type;
			}

			public void setType(String type) {
				this.type = type;
			}

			public RedirectInfoDTO getRedirectInfo() {
				return redirectInfo;
			}

			public void setRedirectInfo(RedirectInfoDTO redirectInfo) {
				this.redirectInfo = redirectInfo;
			}

			public static class RedirectInfoDTO {
				private String url;
				private String method;

				public String getUrl() {
					return url;
				}

				public void setUrl(String url) {
					this.url = url;
				}

				public String getMethod() {
					return method;
				}

				public void setMethod(String method) {
					this.method = method;
				}

				// Getters and Setters
			}
		}
	}
}
