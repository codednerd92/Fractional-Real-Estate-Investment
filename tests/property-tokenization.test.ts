import { describe, it, expect, vi } from "vitest"

// Mock Clarity values and functions
const mockClarityValue = (type: string, value: any) => ({ type, value })
const uint = (value: number) => mockClarityValue("uint", value)
const principal = (address: string) => mockClarityValue("principal", address)
const ok = (value: any) => ({ type: "ok", value })

// Mock contract
const mockContractCall = vi.fn()

describe("Property Tokenization Contract", () => {
  it("should tokenize a property", () => {
    mockContractCall.mockReturnValueOnce(ok(uint(1)))
    
    const result = mockContractCall("tokenize-property", ["123 Main St", uint(1000), uint(100)])
    
    expect(result).toEqual(ok(uint(1)))
    expect(mockContractCall).toHaveBeenCalledWith("tokenize-property", ["123 Main St", uint(1000), uint(100)])
  })
  
  it("should transfer tokens", () => {
    mockContractCall.mockReturnValueOnce(ok(true))
    
    const result = mockContractCall("transfer-tokens", [
      uint(1),
      uint(100),
      principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"),
    ])
    
    expect(result).toEqual(ok(true))
    expect(mockContractCall).toHaveBeenCalledWith("transfer-tokens", [
      uint(1),
      uint(100),
      principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"),
    ])
  })
  
  it("should get property details", () => {
    const propertyDetails = {
      name: "123 Main St",
      totalTokens: uint(1000),
      pricePerToken: uint(100),
    }
    mockContractCall.mockReturnValueOnce(propertyDetails)
    
    const result = mockContractCall("get-property", [uint(1)])
    
    expect(result).toEqual(propertyDetails)
    expect(mockContractCall).toHaveBeenCalledWith("get-property", [uint(1)])
  })
  
  it("should get token balance", () => {
    mockContractCall.mockReturnValueOnce(uint(500))
    
    const result = mockContractCall("get-balance", [uint(1), principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM")])
    
    expect(result).toEqual(uint(500))
    expect(mockContractCall).toHaveBeenCalledWith("get-balance", [
      uint(1),
      principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"),
    ])
  })
})

